const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, index: true, trim: true },
    notes: { type: String, default: '' },
    preferredService: { type: String, default: '' },
    lastVisitDate: { type: String, default: null },
    nextReminderDate: { type: String, default: null },
    totalVisits: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
