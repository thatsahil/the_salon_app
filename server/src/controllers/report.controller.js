const Customer = require('../models/Customer');
const Visit = require('../models/Visit');
const { memoryStore, getIsConnected } = require('./store');
const revenueService = require('../services/revenue.service');

exports.getRevenueReport = async (req, res) => {
  try {
    const period = req.query.period === 'weekly' ? 'weekly' : 'monthly';
    let visits = [];
    let customers = [];

    if (getIsConnected()) {
      visits = await Visit.find().lean();
      customers = await Customer.find().lean();
    } else {
      visits = memoryStore.visits;
      customers = memoryStore.customers;
    }

    const report = revenueService.calculateReportMetrics(visits, customers, period);

    return res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error('getRevenueReport error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate revenue report' });
  }
};
