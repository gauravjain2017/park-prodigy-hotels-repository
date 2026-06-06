const BASE_URL = 'https://api.liteapi.travel/v3.0'

async function liteapiRequest(endpoint: string, method = 'GET', body?: object) {
  const apiKey = process.env.LITEAPI_KEY
  if (!apiKey) throw new Error('LITEAPI_KEY environment variable is not set')
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
    'Accept': 'application/json',
  }
  if (body) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let msg = `LiteAPI HTTP ${res.status}`
    try { const j = JSON.parse(text); msg = j.message ?? j.error ?? msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export function searchHotels(countryCode: string, cityName: string, limit = 100) {
  return liteapiRequest(
    `/data/hotels?countryCode=${encodeURIComponent(countryCode)}&cityName=${encodeURIComponent(cityName)}&limit=${limit}`
  )
}

export function getHotelDetail(hotelId: string) {
  return liteapiRequest(`/data/hotel?hotelId=${encodeURIComponent(hotelId)}`)
}

export function getRates(body: {
  hotelIds: string[]
  checkin: string
  checkout: string
  currency?: string
  guestNationality?: string
  occupancies: { adults: number; children?: number[] }[]
  roomMapping?: boolean
}) {
  return liteapiRequest('/hotels/rates', 'POST', {
    currency: 'USD',
    guestNationality: 'US',
    roomMapping: true,
    ...body,
  })
}
