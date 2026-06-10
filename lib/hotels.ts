// ── Destination / filter config ───────────────────────────────────────────────

export const DESTINATIONS: Record<string, {
  label: string
  cities: string[]
  country: string
  filters: { id: string; label: string }[]
}> = {
  orlando: {
    label: 'Orlando',
    cities: ['Orlando', 'Kissimmee'],
    country: 'US',
    filters: [
      { id: 'all', label: 'All Orlando' },
      { id: 'universal-onsite', label: 'Official Universal Hotels' },
      { id: 'universal-partner', label: 'Universal Partner Hotels' },
      { id: 'disney-neighbor', label: 'Near Disney World' },
    ],
  },
  anaheim: {
    label: 'Anaheim',
    cities: ['Anaheim'],
    country: 'US',
    filters: [
      { id: 'all', label: 'All Anaheim' },
      { id: 'disney-neighbor', label: 'Disneyland Good Neighbor Hotels' },
    ],
  },
  la: {
    label: 'Los Angeles',
    cities: ['Los Angeles'],
    country: 'US',
    filters: [
      { id: 'all', label: 'All Los Angeles' },
      { id: 'universal-hollywood', label: 'Universal Hollywood Hotels' },
    ],
  },
}

// ── Hotel name keyword filters ────────────────────────────────────────────────

export const UNIVERSAL_ONSITE_KEYWORDS = [
  'portofino bay', 'hard rock hotel', 'royal pacific', 'sapphire falls',
  'helios grand', 'aventura hotel', 'stella nova', 'terra luna',
  'cabana bay', 'endless summer surfside', 'endless summer dockside', 'endless summer',
]

export const HOTEL_FILTERS: Record<string, string[]> = {
  'universal-onsite': UNIVERSAL_ONSITE_KEYWORDS,
  'universal-partner': [
    // Official Universal Partner Hotels — matched from LiteAPI hotel list
    'drury plaza hotel orlando',
    'hyatt regency grand cypress',
    'best western orlando gateway',
    'clarion inn & suites kissimmee-lake buena vista',
    'courtyard by marriott orlando lake buena vista at vista centre',
    'holiday inn resort orlando - lake buena vista',
    'holiday inn express-international drive',
    'holiday inn express & suites orlando at seaworld',
    'holiday inn express & suites s lake buena vista',
    'wyndham i-drive avanti resort',
    'avanti international resort',
    'coco key hotel',
    'hampton inn & suites orlando-south lake buena vista',
    'hampton inn orlando international drive',
    'hampton inn lake buena vista',
    'doubletree by hilton orlando theme park resort',
    'doubletree by hilton at the entrance to universal orlando',
    'rosen inn closest to universal',
    'rosen inn at pointe orlando',
    'rosen inn international',
    'rosen shingle creek',
    'westgate vacation villas',
    'westgate lakes',
    'westgate palace',
    'four points by sheraton orlando international drive',
    'hilton vacation club mystic dunes orlando',
    'hyatt place across from universal orlando',
    'hyatt house orlando universal',
    'home2 suites by hilton orlando near universal',
    'residence inn near universal orlando',
    'fairfield inn & suites by marriott orlando lake buena vista in the marriott village',
    'fairfield inn & suites by marriott orlando lake buena vista',
    'springhill suites by marriott orlando lake buena vista south',
    'springhill suites by marriott orlando theme parks lake buena vista',
    'springhill suites by marriott orlando lake buena vista in marriott village',
    'sonesta es suites orlando',
    'lake buena vista resort village',
    'hilton garden inn orlando',
    'tru by hilton',
    'comfort suites orlando',
  ],
  'disney-neighbor': [
    // Official Disney Good Neighbor Hotels — matched from LiteAPI hotel list
    'caribe royale orlando',
    'delta hotels by marriott orlando celebration',
    'courtyard by marriott orlando lake buena vista at vista centre',
    'holiday inn resort orlando - lake buena vista',
    'holiday inn & suites orlando sw - celebration area',
    'holiday inn express & suites s lake buena vista',
    'holiday inn resort kissimmee by the parks',
    'holiday inn express-international drive',
    'holiday inn express & suites orlando at seaworld',
    'holiday inn & suites orlando - i-drive',
    'holiday inn club vacations at orange lake resort',
    'hampton inn lake buena vista',
    'hampton inn & suites orlando-south lake buena vista',
    'hampton inn orlando international drive',
    'hampton inn kissimmee north',
    'hampton inn & suites orlando north altamonte springs',
    'hampton inn & suites orlando/downtown south',
    'hampton inn & suites orlando airport at gateway village',
    'springhill suites by marriott orlando at flamingo crossings',
    'springhill suites by marriott orlando at seaworld',
    'springhill suites by marriott orlando lake buena vista south',
    'springhill suites by marriott orlando theme parks lake buena vista',
    'springhill suites by marriott orlando lake buena vista in marriott village',
    'fairfield inn & suites by marriott orlando lake buena vista in the marriott village',
    'fairfield inn & suites by marriott orlando lake buena vista',
    'fairfield by marriott inn & suites orlando at seaworld',
    'fairfield by marriott inn & suites orlando at flamingo crossings',
    'residence inn by marriott orlando at seaworld',
    'towneplace suites by marriott orlando at seaworld',
    'towneplace suites orlando at flamingo crossings',
    'home2 suites by hilton orlando flamingo crossings',
    'home2 suites by hilton orlando near universal',
    'hilton vacation club grande villas orlando',
    'hilton vacation club aqua sol orlando west',
    'hilton vacation club mystic dunes orlando',
    'hilton grand vacations club tuscany village orlando',
    'doubletree by hilton orlando theme park resort',
    'doubletree by hilton at the entrance to universal orlando',
    'comfort suites maingate east',
    'lake buena vista resort village',
    'sonesta es suites orlando',
    'wyndham garden orlando airport',
    'wingate by wyndham - orlando international airport',
    'best western plus orlando lake buena vista south',
    'hyatt place across from universal orlando resort',
    'vacation village orlando, celebration',
    'pestana orlando suites - lake buena vista',
    'margaritaville resort orlando',
    'omni orlando resort at championsgate',
    'four points by sheraton orlando international drive',
  ],
  'disney-neighbor-anaheim': [
    'camelot inn', 'candy cane inn', 'carousel inn', 'clarion hotel',
    'desert inn', 'hilton anaheim', 'holiday inn anaheim',
    'howard johnson anaheim', 'hyatt place anaheim',
    'marriott anaheim', 'park inn anaheim',
    'portofino inn anaheim', 'quality inn anaheim',
    'radisson anaheim', 'ramada anaheim', 'sheraton garden grove', 'super 8 anaheim',
    'tropicana inn', 'anaheim', 'near disneyland',
    'best western plus anaheim', 'best western anaheim',
    'doubletree anaheim', 'embassy suites anaheim',
    'fairfield inn anaheim', 'hampton inn anaheim',
    'homewood suites anaheim', 'residence inn anaheim',
    'springhill suites anaheim', 'staybridge anaheim',
    'lemon tree inn', 'anabella hotel', 'katella inn',
  ],
  // ── Universal Hollywood Good Neighbor Hotels (confirmed in LiteAPI) ──────
  'universal-hollywood': [
    'hilton los angeles universal', 'hilton universal city',
    'loews hollywood hotel',
    'the garland', 'garland hotel',
  ],
}

// ── Park Prodigy Recommended Hotels (All Orlando — shown first in order) ──────
export const ORLANDO_RECOMMENDED_KEYWORDS = [
  'drury plaza hotel orlando',
  'walt disney world dolphin',
  'walt disney world swan reserve',
  'walt disney world swan',
  'holiday inn orlando disney springs',
  'hyatt regency grand cypress',
  'caribe royale orlando',
  'ette hotel',
  'endless summer',
  'aventura hotel',
  'loews royal pacific',
  'doubletree by hilton at the entrance to universal',
  'home2 suites by hilton orlando near universal',
  'hyatt place across from universal orlando',
  'signia by hilton orlando',
  'jw marriott orlando bonnet creek',
  'conrad orlando at evermore',
  'four seasons resort orlando at walt disney world',
]

// Returns the pinned index (0-based) if hotel is recommended, or -1
export function getRecommendedIndex(hotelName: string): number {
  const name = hotelName.toLowerCase()
  return ORLANDO_RECOMMENDED_KEYWORDS.findIndex(k => name.includes(k))
}

// ── Hotels with known no resort fees (hardcoded) ─────────────────────────────
const NO_RESORT_FEE_KEYWORDS = ['drury plaza']

export function hasNoResortFee(hotelName: string): boolean {
  const name = (hotelName ?? '').toLowerCase()
  return NO_RESORT_FEE_KEYWORDS.some(k => name.includes(k))
}

// ── Business logic ────────────────────────────────────────────────────────────

export function isUniversalOnsite(hotelName: string): boolean {
  const name = hotelName.toLowerCase()
  return UNIVERSAL_ONSITE_KEYWORDS.some(k => name.includes(k))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAdjustedTotal(hotel: { name?: string }, rate: any): number | null {
  const raw = rate?.offerRetailRate?.amount
  if (!raw) return null
  // 8% discount for Universal onsite hotels (to match/beat direct pricing)
  return isUniversalOnsite(hotel.name ?? '') ? Math.round(raw * 0.92 * 100) / 100 : raw
}

// Returns discount percentage if reference rate is available and higher
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDiscountPct(rate: any): number | null {
  const retail = rate?.offerRetailRate?.amount
  const suggested = rate?.suggestedSellingPrice?.amount
  if (!retail || !suggested || suggested <= retail) return null
  return Math.round((1 - retail / suggested) * 100)
}

export function getNights(checkin: string, checkout: string): number {
  return Math.max(1, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
}

export function fmtPrice(n: number | null | undefined): string {
  if (n == null) return '—'
  return '$' + Math.round(n).toLocaleString()
}

export type TaxInfo = {
  allIncluded: boolean
  known: boolean // false when taxesAndFees is null (unknown)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraFees: any[]
  extraTotal: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTaxInfo(rate: any): TaxInfo {
  const fees = rate?.rates?.[0]?.retailRate?.taxesAndFees
    ?? rate?.rates?.[0]?.taxesAndFees
    ?? rate?.taxesAndFees

  // null/undefined = LiteAPI didn't return fee data — unknown, NOT confirmed included
  if (fees === null || fees === undefined) {
    return { allIncluded: false, known: false, extraFees: [], extraTotal: 0 }
  }

  // Empty array = confirmed all included
  if (!Array.isArray(fees) || fees.length === 0) {
    return { allIncluded: true, known: true, extraFees: [], extraTotal: 0 }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraFees = fees.filter((f: any) => f.included === false && f.amount > 0)
  const extraTotal = extraFees.reduce((s: number, f: { amount?: number }) => s + (f.amount ?? 0), 0)
  return { allIncluded: extraFees.length === 0, known: true, extraFees, extraTotal }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCancelPolicy(rate: any) {
  return rate?.rates?.[0]?.cancellationPolicies
    ?? rate?.rates?.[0]?.cancelPolicy
    ?? rate?.cancellationPolicies
    ?? rate?.cancelPolicy
    ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyHotelFilter(hotels: any[], filterId: string, dest: string): any[] {
  if (filterId === 'all') return hotels
  let keywords = HOTEL_FILTERS[filterId] ?? []
  if (filterId === 'disney-neighbor' && dest === 'anaheim') keywords = HOTEL_FILTERS['disney-neighbor-anaheim']
  if (!keywords.length) return hotels
  return hotels.filter(h => {
    const name = (h.name ?? '').toLowerCase()
    return keywords.some(k => name.includes(k))
  })
}

export type SecondaryFilters = {
  maxPrice: number
  stars: string
  refundableOnly: boolean
  amenities: Set<string>
}

export const DEFAULT_FILTERS: SecondaryFilters = {
  maxPrice: 1000,
  stars: 'all',
  refundableOnly: false,
  amenities: new Set(),
}

export function applySecondaryFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotels: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rateMap: Record<string, any>,
  n: number,
  f: SecondaryFilters,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  return hotels.filter(h => {
    const rate = rateMap[h.id]
    const total = getAdjustedTotal(h, rate)
    const perNight = total && n ? total / n : null

    if (f.maxPrice < 1000) {
      if (perNight === null) return false
      if (perNight > f.maxPrice) return false
    }
    if (f.stars !== 'all') {
      const rawStar = h.starRating ?? h.stars ?? null
      if (rawStar === null || rawStar === 0) return false
      if (String(Math.floor(Number(rawStar))) !== f.stars) return false
    }
    if (f.refundableOnly) {
      if (!rate) return false
      const policy = getCancelPolicy(rate)
      if (policy?.refundableTag !== 'RFN') return false
    }
    if (f.amenities.size > 0) {
      const rawFacs = h.hotelFacilities ?? h.facilities ?? h.amenities ?? []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const facs: string[] = rawFacs.map((s: any) => (typeof s === 'string' ? s : (s.name ?? '')).toLowerCase())
      const boardName = (rate?.boardName ?? rate?.rates?.[0]?.boardName ?? '').toLowerCase()
      const boards = rate?.boardResponses ?? rate?.rates?.[0]?.boardResponses ?? []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasBreakfast = boards.some((b: any) => ['BB', 'HB', 'FB', 'AI', 'BD', 'BL'].includes(b.boardId))
        || boardName.includes('breakfast') || boardName.includes('half board')
        || boardName.includes('full board') || boardName.includes('all inclusive')
        || facs.some(s => s.includes('breakfast'))
      const hasPool = facs.some(s => s.includes('pool') || s.includes('swimming'))
      const hasParking = facs.some(s => s.includes('parking'))
      const hasWifi = facs.some(s => s.includes('wifi') || s.includes('wi-fi') || s.includes('internet') || s.includes('wireless'))
      const hasKitchen = facs.some(s => s.includes('kitchen') || s.includes('kitchenette'))
      const hasFacData = facs.length > 0
      if (f.amenities.has('pool') && hasFacData && !hasPool) return false
      if (f.amenities.has('parking') && hasFacData && !hasParking) return false
      if (f.amenities.has('breakfast') && !hasBreakfast) return false
      if (f.amenities.has('wifi') && hasFacData && !hasWifi) return false
      if (f.amenities.has('kitchen') && hasFacData && !hasKitchen) return false
    }
    return true
  })
}

export function getSortedHotels(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotels: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rateMap: Record<string, any>,
  sort: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  const withR = hotels.filter(h => rateMap[h.id])
  const noR = hotels.filter(h => !rateMap[h.id])
  let sorted = [...withR]
  if (sort === 'price') {
    sorted.sort((a, b) => (getAdjustedTotal(a, rateMap[a.id]) ?? 9999) - (getAdjustedTotal(b, rateMap[b.id]) ?? 9999))
  } else if (sort === 'rating') {
    sorted.sort((a, b) => (b.rating ?? b.guestScore ?? 0) - (a.rating ?? a.guestScore ?? 0))
  }
  return [...sorted, ...noR]
}

// ── Room detail helpers ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findRoomDetail(rate: any, detailRooms: any[]): any | null {
  if (!detailRooms?.length) return null
  const mappedId = rate?.rates?.[0]?.mappedRoomId ?? rate?.mappedRoomId ?? null
  if (mappedId) {
    const found = detailRooms.find(dr => dr.id == mappedId)
    if (found) return found
  }
  const rateName = (rate?.name ?? '').toLowerCase()
  return (
    detailRooms.find(dr => dr.roomName?.toLowerCase() === rateName) ??
    detailRooms.find(dr => dr.roomName && (
      rateName.includes(dr.roomName.toLowerCase()) || dr.roomName.toLowerCase().includes(rateName)
    )) ??
    detailRooms[0] ??
    null
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRoomPhoto(rate: any, detailRooms: any[], hotelImages: any[]): string {
  const detail = findRoomDetail(rate, detailRooms)
  if (detail?.photos?.length) return detail.photos[0]?.url ?? detail.photos[0]?.failoverPhoto ?? ''
  return hotelImages[0]?.url ?? ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRoomName(rate: any, detailRooms: any[]): string {
  const name = rate?.name ?? ''
  if (name && name.toLowerCase() !== 'standard room') return name
  const detail = findRoomDetail(rate, detailRooms)
  return detail?.roomName ?? name ?? 'Standard Room'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRoomBeds(rate: any, detailRooms: any[]): string {
  const detail = findRoomDetail(rate, detailRooms)
  if (!detail?.bedTypes?.length) return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return detail.bedTypes.map((b: any) => `${b.quantity} ${b.bedType}`).join(', ')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRoomDescription(rate: any, detailRooms: any[]): string {
  const detail = findRoomDetail(rate, detailRooms)
  const raw = detail?.description || rate?.roomDescription || ''
  return raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRoomAmenities(rate: any, detailRooms: any[]): string[] {
  const detail = findRoomDetail(rate, detailRooms)
  if (!detail?.roomAmenities?.length) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return detail.roomAmenities.filter((a: any) => a.name).slice(0, 6).map((a: any) => a.name as string)
}
