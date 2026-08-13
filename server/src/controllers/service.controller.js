const Service = require('../models/Service');
const { memoryStore, getIsConnected } = require('./store');

exports.getServices = async (req, res) => {
  try {
    const adminId = req.user?.id || req.user?.userId;
    let services = [];
    if (getIsConnected()) {
      services = await Service.find({
        $or: [{ adminId }, { adminId: { $exists: false } }, { adminId: null }],
        isActive: true,
      })
        .sort({ name: 1 })
        .lean();
    } else {
      services = memoryStore.services.filter(
        (s) =>
          s.isActive &&
          (!s.adminId || String(s.adminId) === String(adminId))
      );
    }
    return res.json({ success: true, data: services });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, price } = req.body;
    const adminId = req.user?.id || req.user?.userId;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Service name and price are required' });
    }

    const numPrice = Number(price) || 0;

    if (getIsConnected()) {
      const newService = await Service.create({
        adminId,
        name: name.trim(),
        price: numPrice,
        isActive: true,
      });
      return res.status(201).json({ success: true, data: newService });
    } else {
      const newService = {
        _id: 'srv_' + Date.now(),
        adminId: String(adminId),
        name: name.trim(),
        price: numPrice,
        isActive: true,
      };
      memoryStore.services.push(newService);
      return res.status(201).json({ success: true, data: newService });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create service' });
  }
};
