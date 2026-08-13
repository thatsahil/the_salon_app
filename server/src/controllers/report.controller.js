const Customer = require('../models/Customer');
const Visit = require('../models/Visit');
const { memoryStore, getIsConnected } = require('./store');
const revenueService = require('../services/revenue.service');

exports.getRevenueReport = async (req, res) => {
  try {
    const period = req.query.period === 'weekly' ? 'weekly' : 'monthly';
    const offset = parseInt(req.query.offset, 10) || 0;
    const adminId = req.user.id || req.user.userId;

    let visits = [];
    let customers = [];

    if (getIsConnected()) {
      visits = await Visit.find({ adminId }).lean();
      customers = await Customer.find({ adminId }).lean();
    } else {
      visits = memoryStore.visits.filter((v) => String(v.adminId) === String(adminId));
      customers = memoryStore.customers.filter((c) => String(c.adminId) === String(adminId));
    }

    const report = revenueService.calculateReportMetrics(visits, customers, period, offset);

    return res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error('getRevenueReport error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate revenue report' });
  }
};
