const { normalizePhone } = require('../utils/phone');
const { calculateNextReminderDate } = require('../utils/date');

class CustomerService {
  normalizePhoneInput(phone) {
    return normalizePhone(phone);
  }

  calculateNextReminder(visitDate) {
    return calculateNextReminderDate(visitDate);
  }

  /**
   * Helper to format customer payload for creation/updating
   */
  prepareCustomerData(data) {
    const normPhone = this.normalizePhoneInput(data.phoneNumber);
    return {
      name: data.name ? data.name.trim() : '',
      phoneNumber: normPhone,
      notes: data.notes || '',
      preferredService: data.preferredService || '',
    };
  }
}

module.exports = new CustomerService();
