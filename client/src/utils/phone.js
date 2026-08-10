/**
 * Phone formatting and WhatsApp reminder link helper
 */

export function normalizePhone(phone = '') {
  let digits = phone.toString().replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  return digits;
}

export function formatPhoneDisplay(phone = '') {
  const norm = normalizePhone(phone);
  if (norm.length === 10) {
    return `+91 ${norm.slice(0, 5)} ${norm.slice(5)}`;
  }
  return phone;
}

export function getWhatsAppReminderUrl(phone, customerName = 'Valued Customer', salonName = 'Serene Salon') {
  const norm = normalizePhone(phone);
  const fullPhone = norm.length === 10 ? `91${norm}` : norm;
  const message = `Hi ${customerName}! It's time for your monthly salon visit at ${salonName} ✨ Reply to let us know your preferred time!`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}
