export type SupportedCurrency = "USD" | "GBP" | "QAR"

export function getPreferredCurrency(locale?: string | null): SupportedCurrency {
  if (!locale) return "USD"
  const normalized = locale.replace("_", "-")
  const parts = normalized.split("-")
  const region = parts.length > 1 ? parts[1].toUpperCase() : ""

  if (region === "GB") return "GBP"
  if (region === "QA") return "QAR"
  if (region === "US") return "USD"

  return "USD"
}

export function formatCurrency(amount: number, currency: SupportedCurrency) {
  const isWhole = Number.isInteger(amount)
  const fractionDigits = amount < 1 ? 2 : isWhole ? 0 : 2

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}
