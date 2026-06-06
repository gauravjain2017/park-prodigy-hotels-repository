import { NextRequest, NextResponse } from 'next/server'
import { getRates } from '@/lib/liteapi'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.hotelIds?.length || !body?.checkin || !body?.checkout) {
    return NextResponse.json({ error: 'hotelIds, checkin, and checkout are required' }, { status: 400 })
  }

  try {
    const data = await getRates({
      hotelIds: body.hotelIds,
      checkin: body.checkin,
      checkout: body.checkout,
      currency: body.currency ?? 'USD',
      guestNationality: body.guestNationality ?? 'US',
      occupancies: body.occupancies ?? [{ adults: 2 }],
      roomMapping: body.roomMapping ?? true,
    })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
