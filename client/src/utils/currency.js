/**
 * Format numbers as Indian Rupee (₹) currency string
 * e.g., 450 -> "₹450", 12500 -> "₹12,500"
 */
export function formatCurrency(amount = 0) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}
