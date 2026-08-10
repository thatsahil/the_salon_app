const Customer = require('../models/Customer');
const Visit = require('../models/Visit');
const Service = require('../models/Service');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { normalizePhone } = require('../utils/phone');
const { formatDate, calculateNextReminderDate } = require('../utils/date');
const bcrypt = require('bcryptjs');

// In-Memory Seed Data for immediate local testing when DB is not connected
const now = new Date();
const todayStr = formatDate(now);

// Helper for past/future dates
function offsetDateStr(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

const memoryStore = {
  users: [
    {
      _id: 'user_1',
      name: 'Akshay Kumar',
      email: 'akshay@serenesalon.com',
      passwordHash: bcrypt.hashSync('salon123', 10),
      salonName: 'Serene Salon & Studio',
    },
  ],
  services: [
    { _id: 'srv_1', name: 'Haircut & Styling', price: 450, isActive: true },
    { _id: 'srv_2', name: 'Beard Trim & Shape', price: 250, isActive: true },
    { _id: 'srv_3', name: 'Hair Color & Spa', price: 1200, isActive: true },
    { _id: 'srv_4', name: 'Refreshing Facial', price: 800, isActive: true },
    { _id: 'srv_5', name: 'Head Massage', price: 350, isActive: true },
  ],
  customers: [
    {
      _id: 'cust_1',
      name: 'Aria Sterling',
      phoneNumber: '9876543210',
      notes: 'Prefers ammonia-free hair color',
      preferredService: 'Hair Color & Spa',
      lastVisitDate: offsetDateStr(-30),
      nextReminderDate: todayStr, // Due today!
      totalVisits: 4,
      totalSpent: 4800,
      isActive: true,
      createdAt: offsetDateStr(-120),
    },
    {
      _id: 'cust_2',
      name: 'Marcus Reed',
      phoneNumber: '9823011223',
      notes: 'Fade haircut level 2',
      preferredService: 'Haircut & Styling',
      lastVisitDate: todayStr,
      nextReminderDate: calculateNextReminderDate(todayStr),
      totalVisits: 6,
      totalSpent: 2700,
      isActive: true,
      createdAt: offsetDateStr(-90),
    },
    {
      _id: 'cust_3',
      name: 'Elena Vance',
      phoneNumber: '9988776655',
      notes: 'Regular monthly facial client',
      preferredService: 'Refreshing Facial',
      lastVisitDate: offsetDateStr(-30),
      nextReminderDate: todayStr, // Due today!
      totalVisits: 3,
      totalSpent: 2400,
      isActive: true,
      createdAt: offsetDateStr(-60),
    },
    {
      _id: 'cust_4',
      name: 'Julian Thorne',
      phoneNumber: '9123456789',
      notes: 'Prefers weekend appointments',
      preferredService: 'Beard Trim & Shape',
      lastVisitDate: offsetDateStr(-5),
      nextReminderDate: offsetDateStr(25),
      totalVisits: 2,
      totalSpent: 700,
      isActive: true,
      createdAt: offsetDateStr(-30),
    },
  ],
  visits: [
    {
      _id: 'vis_1',
      customerId: 'cust_2',
      visitDate: todayStr,
      serviceName: 'Haircut & Styling',
      amount: 450,
      paymentMethod: 'online',
      notes: 'Paid via UPI',
      createdAt: todayStr,
    },
    {
      _id: 'vis_2',
      customerId: 'cust_4',
      visitDate: offsetDateStr(-5),
      serviceName: 'Beard Trim & Shape',
      amount: 250,
      paymentMethod: 'cash',
      notes: 'Cash payment',
      createdAt: offsetDateStr(-5),
    },
    {
      _id: 'vis_3',
      customerId: 'cust_1',
      visitDate: offsetDateStr(-30),
      serviceName: 'Hair Color & Spa',
      amount: 1200,
      paymentMethod: 'cash',
      notes: 'Monthly visit',
      createdAt: offsetDateStr(-30),
    },
  ],
};

module.exports = {
  memoryStore,
  getIsConnected,
};
