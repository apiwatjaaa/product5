export function formatCurrency(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatNumber(amount: number, locale: string, fractionDigits = 0): string {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatCompact(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatPercent(rate: number, locale: string, fractionDigits = 2): string {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(rate);
}
