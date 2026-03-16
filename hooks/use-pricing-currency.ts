import { useEffect, useMemo, useState } from "react"
import { formatCurrency, getPreferredCurrency, SupportedCurrency } from "@/lib/currency"

type Rates = Partial<Record<SupportedCurrency, number>>

export function usePricingCurrency() {
  const [currency, setCurrency] = useState<SupportedCurrency>("USD")
  const [rates, setRates] = useState<Rates>({})

  useEffect(() => {
    if (typeof navigator === "undefined") return
    setCurrency(getPreferredCurrency(navigator.language))
  }, [])

  useEffect(() => {
    let isActive = true

    const loadRates = async () => {
      try {
        const res = await fetch("/api/exchange-rates")
        if (!res.ok) throw new Error("Rate fetch failed")
        const data = await res.json()

        const nextRates: Rates = {
          GBP: Number(data?.rates?.GBP),
          QAR: Number(data?.rates?.QAR),
        }

        if (!isActive) return
        setRates(nextRates)
      } catch (error) {
        if (!isActive) return
        setRates({})
        setCurrency("USD")
      }
    }

    loadRates()

    return () => {
      isActive = false
    }
  }, [])

  const activeCurrency = useMemo(() => {
    if (currency === "USD") return "USD"
    const rate = rates[currency]
    if (!rate || !Number.isFinite(rate) || rate <= 0) return "USD"
    return currency
  }, [currency, rates])

  const convert = (amountUSD: number) => {
    if (activeCurrency === "USD") return amountUSD
    const rate = rates[activeCurrency] ?? 1
    return amountUSD * rate
  }

  const format = (amountUSD: number) => {
    return formatCurrency(convert(amountUSD), activeCurrency)
  }

  return {
    currency: activeCurrency,
    convert,
    format,
  }
}
