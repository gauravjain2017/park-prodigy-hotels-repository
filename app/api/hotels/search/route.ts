import { NextRequest, NextResponse } from 'next/server'
import { searchHotels } from '@/lib/liteapi'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const countryCode = searchParams.get('countryCode') ?? ''
  const cityName = searchParams.get('cityName') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)

  if (!countryCode || !cityName) {
    return NextResponse.json({ error: 'countryCode and cityName are required' }, { status: 400 })
  }

  try {
    const data = await searchHotels(countryCode, cityName, limit)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
