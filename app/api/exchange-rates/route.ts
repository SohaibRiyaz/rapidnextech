import { NextResponse } from "next/server"

const EXCHANGE_URL = "https://api.exchangerate.host/latest?base=USD&symbols=GBP,QAR"

export async function GET() {
  try {
    const res = await fetch(EXCHANGE_URL, { next: { revalidate: 3600 } })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch rates" }, { status: 502 })
    }

    const data = await res.json()

    return NextResponse.json({
      base: "USD",
      rates: {
        GBP: data?.rates?.GBP,
        QAR: data?.rates?.QAR,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 })
  }
}
