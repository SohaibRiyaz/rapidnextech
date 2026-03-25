import { useEffect, useState } from "react"
import { formatCurrency, formatUSD, getPreferredCurrency, SupportedCurrency } from "@/lib/currency"

type Rates = Partial<Record<SupportedCurrency, number>>

export function usePricingCurrency() {
  const [currency, setCurrency] = useState<SupportedCurrency>("USD")
  const [rates, setRates] = useState<Rates>({})
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof navigator === "undefined") return
    setCurrency(getPreferredCurrency(navigator.language))
    setIsHydrated(true)
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

  const rate = currency === "USD" ? 1 : rates[currency]
  const canConvert = currency === "USD" || (rate && Number.isFinite(rate) && rate > 0)

  const convert = (amountUSD: number) => {
    if (!canConvert || currency === "USD") return amountUSD
    return amountUSD * (rate ?? 1)
  }

  const format = (amountUSD: number) => {
    if (!isHydrated || !canConvert) {
      return formatUSD(amountUSD)
    }
    if (currency === "USD") {
      return formatUSD(amountUSD)
    }
    return formatCurrency(convert(amountUSD), currency)
  }

  return {
    currency: canConvert ? currency : "USD",
    convert,
    format,
  }
}
