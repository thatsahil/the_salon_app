const Customer = require('../models/Customer');
const Visit = require('../models/Visit');
const { memoryStore, getIsConnected } = require('./store');
const { normalizePhone } = require('../utils/phone');
const { formatDate, calculateNextReminderDate } = require('../utils/date');

// Search and list clients
exports.getClients = async (req, res) => {
  try {
    const { query } = req.query;
    let customers = [];

    if (getIsConnected()) {
      let filter = { isActive: true };
      if (query && query.trim()) {
        const q = query.trim();
        const normQ = normalizePhone(q);
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { phoneNumber: { $regex: normQ || q, $options: 'i' } },
        ];
      }
      customers = await Customer.find(filter).sort({ name: 1 }).lean();
    } else {
      customers = memoryStore.customers.filter((c) => c.isActive);
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        const normQ = normalizePhone(q);
        customers = customers.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phoneNumber.includes(q) ||
            (normQ && c.phoneNumber.includes(normQ))
        );
      }
      customers.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    console.error('getClients error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch clients' });
  }
};

// Get single client profile + visit history
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    let customer = null;
    let visits = [];

    if (getIsConnected()) {
      customer = await Customer.findById(id).lean();
      if (customer) {
        visits = await Visit.find({ customerId: id }).sort({ visitDate: -1, createdAt: -1 }).lean();
      }
    } else {
      customer = memoryStore.customers.find((c) => c._id === id);
      if (customer) {
        visits = memoryStore.visits
          .filter((v) => String(v.customerId) === String(id))
          .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
      }
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    return res.json({
      success: true,
      data: {
        ...customer,
        visits,
      },
    });
  } catch (err) {
    console.error('getClientById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch client profile' });
  }
};

// Create or return existing client by unique phone number
exports.createClient = async (req, res) => {
  try {
    const { name, phoneNumber, notes, preferredService } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Client name is required' });
    }

    const normPhone = normalizePhone(phoneNumber);
    if (!normPhone) {
      return res.status(400).json({ success: false, message: 'Valid phone number is required' });
    }

    if (getIsConnected()) {
      // Check if existing phone number exists
      let existing = await Customer.findOne({ phoneNumber: normPhone });
      if (existing) {
        return res.json({
          success: true,
          isExisting: true,
          message: 'Client with this phone number already exists.',
          data: existing,
        });
      }

      const newCustomer = await Customer.create({
        name: name.trim(),
        phoneNumber: normPhone,
        notes: notes || '',
        preferredService: preferredService || '',
        lastVisitDate: null,
        nextReminderDate: null,
        totalVisits: 0,
        totalSpent: 0,
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        isExisting: false,
        message: 'Client created successfully',
        data: newCustomer,
      });
    } else {
      let existing = memoryStore.customers.find((c) => c.phoneNumber === normPhone);
      if (existing) {
        return res.json({
          success: true,
          isExisting: true,
          message: 'Client with this phone number already exists.',
          data: existing,
        });
      }

      const newCustomer = {
        _id: 'cust_' + Date.now(),
        name: name.trim(),
        phoneNumber: normPhone,
        notes: notes || '',
        preferredService: preferredService || '',
        lastVisitDate: null,
        nextReminderDate: null,
        totalVisits: 0,
        totalSpent: 0,
        isActive: true,
        createdAt: formatDate(new Date()),
      };
      memoryStore.customers.push(newCustomer);

      return res.status(201).json({
        success: true,
        isExisting: false,
        message: 'Client created successfully',
        data: newCustomer,
      });
    }
  } catch (err) {
    console.error('createClient error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create client' });
  }
};

// Update client info
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, notes, preferredService } = req.body;

    let normPhone = phoneNumber ? normalizePhone(phoneNumber) : undefined;

    if (getIsConnected()) {
      if (normPhone) {
        // Ensure phone uniqueness across other clients
        const duplicate = await Customer.findOne({ phoneNumber: normPhone, _id: { $ne: id } });
        if (duplicate) {
          return res.status(400).json({ success: false, message: 'Another client already uses this phone number' });
        }
      }

      const updated = await Customer.findByIdAndUpdate(
        id,
        {
          ...(name && { name: name.trim() }),
          ...(normPhone && { phoneNumber: normPhone }),
          ...(notes !== undefined && { notes }),
          ...(preferredService !== undefined && { preferredService }),
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      return res.json({ success: true, data: updated });
    } else {
      const idx = memoryStore.customers.findIndex((c) => c._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      if (normPhone) {
        const dup = memoryStore.customers.find((c) => c.phoneNumber === normPhone && c._id !== id);
        if (dup) {
          return res.status(400).json({ success: false, message: 'Another client already uses this phone number' });
        }
      }

      const client = memoryStore.customers[idx];
      if (name) client.name = name.trim();
      if (normPhone) client.phoneNumber = normPhone;
      if (notes !== undefined) client.notes = notes;
      if (preferredService !== undefined) client.preferredService = preferredService;

      return res.json({ success: true, data: client });
    }
  } catch (err) {
    console.error('updateClient error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update client' });
  }
};

// Create Visit for client and recalculate nextReminderDate
exports.createVisit = async (req, res) => {
  try {
    const { id } = req.params; // customerId
    const { serviceName, amount, paymentMethod, visitDate, notes } = req.body;

    if (!serviceName || amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: 'Service name and amount are required' });
    }

    const vDate = visitDate ? formatDate(new Date(visitDate)) : formatDate(new Date());
    const nextReminder = calculateNextReminderDate(vDate);
    const numAmount = Number(amount) || 0;
    const pMethod = paymentMethod === 'online' ? 'online' : 'cash';

    if (getIsConnected()) {
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      // Record Visit
      const newVisit = await Visit.create({
        customerId: id,
        visitDate: vDate,
        serviceName,
        amount: numAmount,
        paymentMethod: pMethod,
        notes: notes || '',
      });

      // Update Customer record (Early visit supersedes old reminder date)
      customer.lastVisitDate = vDate;
      customer.nextReminderDate = nextReminder;
      customer.totalVisits = (customer.totalVisits || 0) + 1;
      customer.totalSpent = (customer.totalSpent || 0) + numAmount;
      await customer.save();

      return res.status(201).json({
        success: true,
        message: 'Visit recorded and next monthly reminder calculated',
        data: {
          visit: newVisit,
          customer,
        },
      });
    } else {
      const customer = memoryStore.customers.find((c) => c._id === id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      const newVisit = {
        _id: 'vis_' + Date.now(),
        customerId: id,
        visitDate: vDate,
        serviceName,
        amount: numAmount,
        paymentMethod: pMethod,
        notes: notes || '',
        createdAt: vDate,
      };

      memoryStore.visits.push(newVisit);

      customer.lastVisitDate = vDate;
      customer.nextReminderDate = nextReminder;
      customer.totalVisits = (customer.totalVisits || 0) + 1;
      customer.totalSpent = (customer.totalSpent || 0) + numAmount;

      return res.status(201).json({
        success: true,
        message: 'Visit recorded and next monthly reminder calculated',
        data: {
          visit: newVisit,
          customer,
        },
      });
    }
  } catch (err) {
    console.error('createVisit error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record visit' });
  }
};
