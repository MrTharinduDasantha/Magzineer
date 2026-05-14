// Formats a number as USD currency (e.g. $19.99) — change locale/currency as needed
export const formatCurrency = (amount, currency = "USD") => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
};
