interface FormatCurrencyOptions {
  currency?: string;
  maximumFractionDigits?: number;
}

export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {},
): string {
  const { currency = "PKR", maximumFractionDigits = 0 } = options;

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(value);
}
