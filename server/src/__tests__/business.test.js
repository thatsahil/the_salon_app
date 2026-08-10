const assert = require('assert');
const { normalizePhone, formatPhoneDisplay } = require('../utils/phone');
const { calculateNextReminderDate, isDueToday, formatDate } = require('../utils/date');
const reminderService = require('../services/reminder.service');
const revenueService = require('../services/revenue.service');

console.log('🧪 Running Business Rules Unit Tests...\n');

// 1. Phone Normalization Tests
assert.strictEqual(normalizePhone('+91 98765 43210'), '9876543210');
assert.strictEqual(normalizePhone('9876543210'), '9876543210');
assert.strictEqual(normalizePhone('919876543210'), '9876543210');
console.log('✅ Phone normalization tests passed.');

// 2. Reminder Date Calculation Tests
assert.strictEqual(calculateNextReminderDate('2026-03-15'), '2026-04-15');
assert.strictEqual(calculateNextReminderDate('2026-01-31'), '2026-02-28');
assert.strictEqual(calculateNextReminderDate('2026-12-10'), '2027-01-10');
console.log('✅ Reminder date calculation tests passed.');

// 3. Due Today Check
const todayStr = formatDate(new Date());
assert.strictEqual(isDueToday(todayStr), true);
assert.strictEqual(isDueToday('2020-01-01'), false);
console.log('✅ Due today check tests passed.');

// 4. Revenue Aggregation Tests
const mockVisits = [
  { visitDate: todayStr, amount: 500, paymentMethod: 'cash' },
  { visitDate: todayStr, amount: 750, paymentMethod: 'online' },
  { visitDate: '2026-01-01', amount: 300, paymentMethod: 'cash' },
];

const dashMetrics = revenueService.calculateDashboardMetrics(mockVisits);
assert.strictEqual(dashMetrics.todayRevenue, 1250);
assert.strictEqual(dashMetrics.todayVisitsCount, 2);

const reportMetrics = revenueService.calculateReportMetrics(mockVisits, [], 'monthly');
assert.strictEqual(reportMetrics.cashTotal, 500);
assert.strictEqual(reportMetrics.onlineTotal, 750);
assert.strictEqual(reportMetrics.totalRevenue, 1250);
console.log('✅ Revenue aggregation tests passed.');

console.log('\n🎉 ALL BUSINESS LOGIC UNIT TESTS PASSED SUCCESSFULLY!');
