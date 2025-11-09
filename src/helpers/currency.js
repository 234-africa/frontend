/**
 * Currency formatting utilities for consistent display across the application
 */

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "GH₵",
};

/**
 * Get currency symbol for a given currency code
 * @param {string} currency - Currency code (NGN, USD, GBP, EUR, GHS)
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currency) {
  const normalizedCurrency = currency ? currency.toUpperCase() : "NGN";
  return CURRENCY_SYMBOLS[normalizedCurrency] || "₦";
}

/**
 * Format price with currency symbol
 * @param {number} price - Price amount
 * @param {string} currency - Currency code (default: NGN)
 * @returns {string} Formatted price with symbol
 */
export function formatPrice(price, currency = "NGN") {
  if (!price || price === 0) return "Free";
  return `${getCurrencySymbol(currency)}${price.toLocaleString()}`;
}

/**
 * Get ticket price range from tickets array
 * @param {Array} tickets - Array of ticket objects with price and currency
 * @returns {string} Formatted price range
 */
export function getTicketPriceRange(tickets) {
  if (!tickets || tickets.length === 0) return "";

  const sorted = [...tickets].sort((a, b) => a.price - b.price);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];

  if (lowest.price === 0 && highest.price === 0) return "Free";
  if (lowest.price === highest.price) return formatPrice(lowest.price, lowest.currency);

  // If all tickets have the same currency, show range with one currency symbol
  const allSameCurrency = tickets.every((t) => t.currency === lowest.currency);
  if (allSameCurrency) {
    return `${formatPrice(lowest.price, lowest.currency)} - ${formatPrice(
      highest.price,
      highest.currency
    )}`;
  }

  // Different currencies: show each with its symbol
  return `${formatPrice(lowest.price, lowest.currency)} - ${formatPrice(
    highest.price,
    highest.currency
  )}`;
}

/**
 * Determine payment gateway based on currency
 * NGN, GHS → Paystack (for Nigerian and Ghanaian payments)
 * USD, GBP, EUR → Stripe (for international payments)
 * @param {string} currency - Currency code
 * @returns {string} Payment gateway name ('paystack' or 'stripe')
 */
export function getPaymentGateway(currency) {
  const normalizedCurrency = currency ? currency.toUpperCase() : "NGN";
  const paystackCurrencies = ["NGN", "GHS"];
  return paystackCurrencies.includes(normalizedCurrency) ? "paystack" : "stripe";
}
