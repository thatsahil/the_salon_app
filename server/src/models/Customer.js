const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
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

customerSchema.index({ adminId: 1, phoneNumber: 1 });

module.exports = mongoose.model('Customer', customerSchema);
