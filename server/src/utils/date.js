/**
 * Date utilities for Salon Reminder App
 */

// Format Date object to YYYY-MM-DD string
function formatDate(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the next reminder date:
 * Exactly the same calendar day in the following month after completed visit.
 * Handles month overflows (e.g. Jan 31 -> Feb 28/29).
 */
function calculateNextReminderDate(visitDateInput) {
  const visitDate = new Date(visitDateInput);
  const year = visitDate.getFullYear();
  const month = visitDate.getMonth(); // 0-indexed
  const day = visitDate.getDate();

  // Target month is month + 1
  let targetYear = year;
  let targetMonth = month + 1;

  if (targetMonth > 11) {
    targetMonth = 0;
    targetYear += 1;
  }

  // Get total days in target month
  const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const targetDay = Math.min(day, daysInTargetMonth);

  const reminderDate = new Date(targetYear, targetMonth, targetDay);
  return formatDate(reminderDate);
}

/**
 * Checks if nextReminderDate is due today
 */
function isDueToday(nextReminderDateInput) {
  if (!nextReminderDateInput) return false;
  const todayStr = formatDate(new Date());
  const reminderStr = formatDate(new Date(nextReminderDateInput));
  return reminderStr === todayStr;
}

/**
 * Checks if nextReminderDate is overdue (before today)
 */
function isOverdue(nextReminderDateInput) {
  if (!nextReminderDateInput) return false;
  const todayStr = formatDate(new Date());
  const reminderStr = formatDate(new Date(nextReminderDateInput));
  return reminderStr < todayStr;
}

module.exports = {
  formatDate,
  calculateNextReminderDate,
  isDueToday,
  isOverdue,
};
