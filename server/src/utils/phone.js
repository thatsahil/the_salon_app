/**
 * Normalizes phone numbers to standard digit-only or standard +91 format.
 * E.g., "+91 98765 43210" -> "9876543210"
 */
function normalizePhone(phone) {
  if (!phone) return '';
  // Strip all non-digit characters
  let digits = phone.toString().replace(/\D/g, '');
  // If 12 digits starting with 91, strip country code for consistent 10-digit format
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  return digits;
}

function formatPhoneDisplay(phone) {
  const norm = normalizePhone(phone);
  if (norm.length === 10) {
    return `${norm.slice(0, 5)} ${norm.slice(5)}`;
  }
  return phone;
}

module.exports = {
  normalizePhone,
  formatPhoneDisplay,
};
