/**
 * Currency formatting utilities for consistent display across the application
 */

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "GH₵",
  KES: "KSh",
  UGX: "USh",
  ZMW: "ZK",
  ZAR: "R",
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
 * Get available payment gateways for a given currency (2025 Official API Support)
 * Per official docs:
 * - Paystack: NGN only (https://paystack.com/docs)
 * - AlatPay: NGN and USD (https://docs.alatpay.ng/web-plugin)
 * - Fincra: NGN, GHS, KES, UGX, ZMW, ZAR, USD, XAF, XOF, TZS (https://docs.fincra.com/docs/checkout-redirect)
 * 
 * NGN → Paystack, Alat Pay, and Fincra
 * USD → Alat Pay and Fincra
 * GHS, KES, UGX, ZMW, ZAR, XAF, XOF, TZS → Fincra only
 * @param {string} currency - Currency code
 * @returns {string[]} Array of available payment gateway names
 */
export function getAvailablePaymentGateways(currency) {
  const normalizedCurrency = currency ? currency.toUpperCase() : "NGN";
  
  if (normalizedCurrency === "NGN") {
    // NGN supports Paystack, Alat Pay, and Fincra (in that order)
    return ["paystack", "alatpay", "fincra"];
  } else if (normalizedCurrency === "USD") {
    // USD supports AlatPay (for cards) and Fincra
    return ["alatpay", "fincra"];
  } else if (["GHS", "KES", "UGX", "ZMW", "ZAR", "XAF", "XOF", "TZS"].includes(normalizedCurrency)) {
    // These currencies use Fincra only
    return ["fincra"];
  } else {
    // Fallback to Fincra for unsupported currencies
    return ["fincra"];
  }
}

/**
 * Determine payment gateway based on currency (for backward compatibility)
 * Per official docs:
 * - Paystack → NGN only (default for NGN)
 * - Alat Pay → NGN, USD (https://docs.alatpay.ng/web-plugin)
 * - Fincra → NGN, GHS, KES, UGX, ZMW, ZAR, USD, XAF, XOF, TZS (https://docs.fincra.com/docs/checkout-redirect)
 * @param {string} currency - Currency code
 * @returns {string} Payment gateway name ('paystack', 'alatpay', or 'fincra')
 * @deprecated Use getAvailablePaymentGateways() instead for multi-gateway support
 */
export function getPaymentGateway(currency) {
  const normalizedCurrency = currency ? currency.toUpperCase() : "NGN";
  
  if (normalizedCurrency === "NGN") {
    return "paystack";
  } else if (["GHS", "KES", "UGX", "ZMW", "ZAR", "USD", "XAF", "XOF", "TZS"].includes(normalizedCurrency)) {
    return "fincra";
  } else {
    return "fincra";
  }
}
