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

export function getWhatsAppReminderUrl(
  phone,
  customerName = 'Valued Customer',
  salonName = 'AK Hair Studio',
  locationUrl = 'https://maps.app.goo.gl/DFfjus6oEXPpaKaHA'
) {
  const norm = normalizePhone(phone);
  const fullPhone = norm.length === 10 ? `91${norm}` : norm;
  const message = `Hi *${customerName}*! 👋✨

It's been a month since your last visit to *${salonName}* — we’d love to welcome you back! 💇‍♂️💇‍♀️

✨ Ready for a fresh new look?

📅 Book your next visit at your convenience.
📍 Find us here: ${locationUrl}
📞 +91 72194 91949

Looking forward to seeing you!
*${salonName}*`;

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}


