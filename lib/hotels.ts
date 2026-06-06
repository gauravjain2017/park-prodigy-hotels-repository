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
    'doubletree', 'holiday inn & suites across from universal', 'holiday inn and suites across',
    'hyatt house across from universal', 'hyatt place across from universal',
    'best western orlando gateway', 'coco key', 'four points sheraton',
    'avanti resort', 'avanti palms', 'drury inn', 'rosen inn at pointe',
    'tru by hilton', 'hilton garden inn orlando', 'home2 suites orlando universal',
    'loews royal pacific',
  ],
  'disney-neighbor': [
    'buena vista', 'lake buena vista', 'bonnet creek', 'disney springs',
    'hilton orlando buena vista', 'jw marriott orlando', 'waldorf astoria orlando',
    'four seasons orlando', 'wyndham orlando', 'marriott village', 'courtyard marriott village',
    'fairfield inn marriott village', 'springhill suites marriott village',
    'hyatt place lake buena vista', 'hyatt regency orlando',
    'hilton garden inn lake buena vista', 'hampton inn lake buena vista',
    'best western lake buena vista', 'holiday inn orlando disney',
    'comfort suites maingate', 'comfort suites lake buena vista',
    'quality suites lake buena vista', 'rosen inn maingate', 'rosen inn near universal',
    'rosen inn international', 'rosen shingle creek', 'omni orlando',
    'sheraton orlando lake buena vista', 'holiday inn resort orlando suites',
    'radisson resort orlando', 'westgate lakes', 'westgate town center',
    'orange lake resort', 'holiday inn club vacations',
    'margaritaville resort orlando', 'flamingo crossings',
    'aloft lake buena vista', 'ac hotel lake buena vista',
    'embassy suites lake buena vista', 'doubletree suites disney springs area',
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
  'holiday inn orlando disney springs',
  'hyatt regency grand cypress',
  'caribe royale orlando',
  'ette hotel',
  'endless summer',
  'aventura hotel',
  'royal pacific',
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
