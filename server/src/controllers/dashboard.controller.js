const Customer = require('../models/Customer');
const Visit = require('../models/Visit');
const { memoryStore, getIsConnected } = require('./store');
const { formatDate, isDueToday } = require('../utils/date');
const reminderService = require('../services/reminder.service');
const revenueService = require('../services/revenue.service');

exports.getDashboard = async (req, res) => {
  try {
    const todayStr = formatDate(new Date());
    let customers = [];
    let visits = [];

    if (getIsConnected()) {
      customers = await Customer.find({ isActive: true }).lean();
      visits = await Visit.find().lean();
    } else {
      customers = memoryStore.customers.filter((c) => c.isActive);
      visits = memoryStore.visits;
    }

    // Filter customers due today for alerts
    const alerts = customers.filter((c) => isDueToday(c.nextReminderDate));

    // Calculate today's metrics
    const { todayRevenue, todayVisitsCount } = revenueService.calculateDashboardMetrics(visits);

    return res.json({
      success: true,
      data: {
        todayDate: todayStr,
        todayVisitsCount,
        todayRevenue,
        alertsCount: alerts.length,
        alerts: alerts.map((c) => ({
          _id: c._id,
          name: c.name,
          phoneNumber: c.phoneNumber,
          lastVisitDate: c.lastVisitDate,
          nextReminderDate: c.nextReminderDate,
          preferredService: c.preferredService,
          totalVisits: c.totalVisits,
        })),
      },
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    return res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
};
