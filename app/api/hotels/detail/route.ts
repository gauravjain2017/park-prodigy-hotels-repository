import { NextRequest, NextResponse } from 'next/server'
import { getHotelDetail } from '@/lib/liteapi'

export async function GET(req: NextRequest) {
  const hotelId = req.nextUrl.searchParams.get('hotelId') ?? ''

  if (!hotelId) {
    return NextResponse.json({ error: 'hotelId is required' }, { status: 400 })
  }

  try {
    const data = await getHotelDetail(hotelId)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
