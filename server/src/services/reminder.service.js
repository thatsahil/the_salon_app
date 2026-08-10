const { calculateNextReminderDate, isDueToday, isOverdue } = require('../utils/date');

/**
 * Service to handle customer visit reminders
 */
class ReminderService {
  /**
   * Calculates next reminder date from visit date
   */
  getReminderDateForVisit(visitDate) {
    return calculateNextReminderDate(visitDate);
  }

  /**
   * Filter customer list for those due today
   */
  filterDueToday(customers) {
    return customers.filter((c) => isDueToday(c.nextReminderDate));
  }

  /**
   * Filter customer list for those overdue
   */
  filterOverdue(customers) {
    return customers.filter((c) => isOverdue(c.nextReminderDate));
  }
}

module.exports = new ReminderService();
