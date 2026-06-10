'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  DESTINATIONS,
  getNights,
  applySecondaryFilters, getSortedHotels, applyHotelFilter,
  DEFAULT_FILTERS, SecondaryFilters,
  getRecommendedIndex,
} from '@/lib/hotels'
import { GuestSelector, GuestConfig } from '@/components/GuestSelector'
import { HotelCard } from '@/components/HotelCard'
import { FiltersPanel } from '@/components/FiltersPanel'

// Ordered list of Park Prodigy recommended hotels for All Orlando
const RECOMMENDED_ORDER = [
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

function inDays(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function SkeletonCard() {
  return (
    <div className="hotel-card skeleton-card">
      <div className="hotel-card-inner">
        <div className="hotel-img"><div className="shimmer shimmer--img" /></div>
        <div className="hotel-body">
          <div className="hotel-info">
            <div className="shimmer shimmer--title" />
            <div className="shimmer shimmer--line-sm" />
            <div className="shimmer shimmer--line" />
            <div className="shimmer shimmer--line-md" />
          </div>
          <div className="hotel-price">
            <div className="shimmer shimmer--price-sm" />
            <div className="shimmer shimmer--price-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

function fmtDateDisplay(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}

function DateRangeField({ checkin, checkout, onCheckinChange, onCheckoutChange }: {
  checkin: string; checkout: string
  onCheckinChange: (v: string) => void; onCheckoutChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      function handler(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }
  }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = open && isMobile ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open, isMobile])

  const label = checkin && checkout
    ? `${fmtDateDisplay(checkin)} - ${fmtDateDisplay(checkout)}`
    : 'Select dates'

  const dateInputs = (
    <>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8a96aa', textTransform: 'uppercase', letterSpacing: '.9px', marginBottom: 6 }}>Check-in</div>
        <div style={{ position: 'relative' }}>
          <input
            type="date" value={checkin} min={inDays(1)}
            onChange={e => {
              const newCheckin = e.target.value
              onCheckinChange(newCheckin)
              if (newCheckin) {
                const d = new Date(newCheckin)
                d.setDate(d.getDate() + 1)
                onCheckoutChange(d.toISOString().split('T')[0])
              }
            }}
            style={{ width: '100%', padding: '8px 36px 8px 12px', border: '1.5px solid #dde0e8', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
          />
          <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8899bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8a96aa', textTransform: 'uppercase', letterSpacing: '.9px', marginBottom: 6 }}>Check-out</div>
        <div style={{ position: 'relative' }}>
          <input
            type="date" value={checkout} min={checkin ? (() => { const d = new Date(checkin); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] })() : inDays(2)}
            onChange={e => onCheckoutChange(e.target.value)}
            style={{ width: '100%', padding: '8px 36px 8px 12px', border: '1.5px solid #dde0e8', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
          />
          <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8899bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>
      <button
        onClick={() => setOpen(false)}
        style={{ width: '100%', padding: 11, border: 'none', borderRadius: 50, background: '#005d92', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
      >Done</button>
    </>
  )

  return (
    <div className="search-bar-field search-bar-field--dates" ref={ref} style={{ position: 'relative' }}>
      <div className="search-bar-val-row" style={{ cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <svg className="field-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2" width="12" height="11" rx="2" stroke="#8899bb" strokeWidth="1.5"/>
          <path d="M1 6h12" stroke="#8899bb" strokeWidth="1.5"/>
          <path d="M4 1v2M10 1v2" stroke="#8899bb" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="search-bar-daterange" style={{ flex: 1, fontWeight: 700, fontSize: 15, color: checkin ? '#0d1b2a' : '#aaa', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      </div>

      {open && !isMobile && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999,
          background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,.14)',
          padding: 20, minWidth: 280, border: '1px solid #e8e8e8',
        }} onClick={e => e.stopPropagation()}>
          {dateInputs}
        </div>
      )}

      {open && isMobile && (
        <div className="mobile-sheet-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-sheet" onClick={e => e.stopPropagation()}>
            <div className="mobile-sheet-handle-bar"><div className="mobile-sheet-handle" /></div>
            <div className="mobile-sheet-header">
              <span className="mobile-sheet-title">Select Dates</span>
              <button className="mobile-sheet-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mobile-sheet-body">
              {dateInputs}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()

  const [dest, setDest] = useState(() => {
    if (typeof window === 'undefined') return 'orlando'
    const p = new URLSearchParams(window.location.search)
    const d = p.get('dest')
    return (d && Object.keys(DESTINATIONS).includes(d)) ? d : 'orlando'
  })
  const [filterType, setFilterType] = useState(() => {
    if (typeof window === 'undefined') return 'all'
    const p = new URLSearchParams(window.location.search)
    return p.get('filter') || 'all'
  })
  const [checkin, setCheckin] = useState(inDays(30))
  const [checkout, setCheckout] = useState(inDays(35))
  const [guests, setGuests] = useState<GuestConfig>({ adults: 2, children: 0, childAges: [], rooms: 1 })
  const [searchError, setSearchError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hotels, setHotels] = useState<unknown[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rateMap, setRateMap] = useState<Record<string, any>>({})
  const [searched, setSearched] = useState(false)
  const [filters, setFilters] = useState<SecondaryFilters>({ ...DEFAULT_FILTERS, amenities: new Set() })
  const [sort, setSort] = useState('price')
  const [searchDirty, setSearchDirty] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [hotelSearch, setHotelSearch] = useState('')

  const doSearch = useCallback(async () => {
    if (!checkin || !checkout) { setSearchError('Please select your dates.'); return }
    if (checkout <= checkin) { setSearchError('Check-out must be after check-in.'); return }
    setSearchError('')
    setLoading(true)
    setSearched(true)
    setHotels([])
    setRateMap({})
    setFilters({ maxPrice: 1000, stars: 'all', refundableOnly: false, amenities: new Set() })
    setSort('price')
    setShowMore(false)
    setHotelSearch('')

    const destConfig = DESTINATIONS[dest]
    try {
      const responses = await Promise.all(
        destConfig.cities.map(c =>
          fetch(`/api/hotels/search?countryCode=${destConfig.country}&cityName=${encodeURIComponent(c)}&limit=100`)
            .then(r => r.json())
        )
      )
      const seen = new Set<string>()
      const all: unknown[] = []
      responses.forEach(r => (r.data ?? []).forEach((h: { id: string }) => {
        if (!seen.has(h.id)) { seen.add(h.id); all.push(h) }
      }))

      const filtered = applyHotelFilter(all, filterType, dest)
      setHotels(filtered)

      if (!filtered.length) { setLoading(false); return }

      const occupancies = Array.from({ length: guests.rooms }, () => {
        const occ: { adults: number; children?: number[] } = { adults: guests.adults }
        if (guests.childAges.length) occ.children = guests.childAges
        return occ
      })

      const allIds = filtered.map((h: unknown) => (h as { id: string }).id)
      const BATCH = 10
      const batches: string[][] = []
      for (let i = 0; i < allIds.length; i += BATCH) batches.push(allIds.slice(i, i + BATCH))

      await Promise.allSettled(
        batches.map(batchIds =>
          fetch('/api/hotels/rates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hotelIds: batchIds, checkin, checkout, currency: 'USD', guestNationality: 'US', occupancies, roomMapping: true }),
          })
            .then(r => r.json())
            .then(rd => {
              setRateMap(prev => {
                const next = { ...prev }
                ;(rd.data ?? []).forEach((hr: { hotelId: string; roomTypes?: unknown[] }) => {
                  const rt = hr.roomTypes ?? []
                  if (rt.length) {
                    const cheap = rt.reduce((a: unknown, b: unknown) => {
                      const aa = a as { offerRetailRate?: { amount?: number } }
                      const bb = b as { offerRetailRate?: { amount?: number } }
                      return (aa.offerRetailRate?.amount ?? 9999) < (bb.offerRetailRate?.amount ?? 9999) ? a : b
                    })
                    next[hr.hotelId] = { ...(cheap as object), allRooms: rt }
                  }
                })
                return next
              })
            })
            .catch(() => {})
        )
      )
    } catch (e) {
      setSearchError((e as Error).message)
    }
    setSearchDirty(false)
    setLoading(false)
  }, [checkin, checkout, dest, filterType, guests])

  useEffect(() => { doSearch() }, []) // auto-search on mount

  const n = getNights(checkin, checkout)
  const sorted = getSortedHotels(hotels, rateMap, sort)
  const secondaryFiltered = applySecondaryFilters(sorted, rateMap, n, filters)
  const visible = hotelSearch.trim()
    ? secondaryFiltered.filter(h => ((h as { name?: string }).name ?? '').toLowerCase().includes(hotelSearch.toLowerCase().trim()))
    : secondaryFiltered

  // ── All Orlando: split into recommended (pinned) + rest ─────────────────────
  const isAllOrlando = dest === 'orlando' && filterType === 'all'
  const isUniversalFilter = dest === 'orlando' && filterType === 'universal-onsite'
  const isDisneyFilter = filterType === 'disney-neighbor'
  const isUniversalPartnerFilter = dest === 'orlando' && filterType === 'universal-partner'

  let recommendedHotels: unknown[] = []
  let remainingHotels: unknown[] = []

  if (isAllOrlando) {
    // Sort recommended hotels by their pinned order
    const rec: [number, unknown][] = []
    const rest: unknown[] = []
    visible.forEach(h => {
      const hotel = h as { name?: string }
      const idx = getRecommendedIndex(hotel.name ?? '')
      if (idx >= 0) rec.push([idx, h])
      else rest.push(h)
    })
    rec.sort((a, b) => a[0] - b[0])
    recommendedHotels = rec.map(r => r[1])
    remainingHotels = rest
  }

  function handleSelectHotel(hotelId: string) {
    const url = `/hotel/${hotelId}?checkin=${checkin}&checkout=${checkout}&adults=${guests.adults}&rooms=${guests.rooms}${guests.childAges.length ? `&childAges=${guests.childAges.join(',')}` : ''}&dest=${dest}&filter=${filterType}`
    router.push(url)
  }

  function handleTypeFilterChange(id: string) {
    setFilterType(id)
    setSearchDirty(true)
  }

  useEffect(() => {
    if (searched) doSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, dest])

  return (
    <div className="hotel-search-page">
      <div className="hero">
        <div className="hero-content container">
          <div className="hero-eyebrow">ORLANDO HOTEL DEALS</div>
          <div className="hotels-heading-cls">
            <h1 className="hero-title">
              Book your Disney &amp; Universal hotel &mdash; with <span className="color-accent">insider perks</span>
            </h1>
            <p className="hero-subtitle">
              Hand-picked resorts from a former Disney cast member and a Universal U-Preferred Platinum partner.
              Add discount tickets and unlock free gift cards.
            </p>
          </div>

          <div className="search-bar" id="search-form">
            <input type="hidden" id="city" value={DESTINATIONS[dest].cities[0]} />

            <div className="search-bar-field search-bar-field--dest">
              <div className="search-bar-val-row">
                <svg className="field-icon" width="12" height="15" viewBox="0 0 12 15" fill="none">
                  <path d="M6 0C3.52 0 1.5 2.02 1.5 4.5c0 3.38 4.5 9.75 4.5 9.75S10.5 7.88 10.5 4.5C10.5 2.02 8.48 0 6 0zm0 6.19a1.69 1.69 0 1 1 0-3.38 1.69 1.69 0 0 1 0 3.38z" fill="#8899bb"/>
                </svg>
                <select
                  className="search-bar-select"
                  value={dest}
                  onChange={e => { setDest(e.target.value); setFilterType('all'); setSearchDirty(true) }}
                >
                  <option value="orlando">Orlando, FL</option>
                  <option value="anaheim">Anaheim, CA</option>
                  <option value="la">Los Angeles, CA</option>
                </select>
              </div>
            </div>

            <DateRangeField checkin={checkin} checkout={checkout} onCheckinChange={(v) => { setCheckin(v); setSearchDirty(true) }} onCheckoutChange={(v) => { setCheckout(v); setSearchDirty(true) }} />
            <GuestSelector value={guests} onChange={(v) => { setGuests(v); setSearchDirty(true) }} />

            <button className="search-bar-btn" onClick={doSearch} disabled={loading}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              {loading ? 'Searching...' : 'Search Hotels'}
            </button>
          </div>

          {searchError && <div className="error-box">{searchError}</div>}

          <div className="trust-badges">
            <span className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6l-8-4z" stroke="#2B7DC9" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              U-Preferred Platinum Partner
            </span>
            <span className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.5" fill="#2B7DC9"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7" stroke="#2B7DC9" strokeWidth="1.6" strokeLinecap="round"/><path d="M5.5 5.5a9.5 9.5 0 0 0 0 13M18.5 5.5a9.5 9.5 0 0 1 0 13" stroke="#2B7DC9" strokeWidth="1.6" strokeLinecap="round"/></svg>
              As Seen on NBC Today
            </span>
            <span className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5a623"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              5-Stars on Trustpilot
            </span>
          </div>
        </div>
      </div>

      {(searched || loading) && (
        <div className="results-section">
          {hotels.length > 0 && (
            <FiltersPanel
              hotels={hotels}
              rateMap={rateMap}
              dest={dest}
              currentFilter={filterType}
              currentSort={sort}
              filters={filters}
              checkin={checkin}
              checkout={checkout}
              onFilterChange={setFilters}
              onSortChange={setSort}
              onTypeFilterChange={handleTypeFilterChange}
              onHotelSearch={setHotelSearch}
            />
          )}

          {loading && hotels.length === 0 ? (
            <div className="hotel-list">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : visible.length === 0 && !loading ? (
            <div className="no-filter-results" style={{ margin: '20px auto' }}>
              <h3 className="nfr-title">No hotels match your filters</h3>
              <p className="nfr-desc">Try adjusting your filters to find the perfect hotel.</p>
              <button className="nfr-btn" onClick={() => setFilters({ maxPrice: 1000, stars: 'all', refundableOnly: false, amenities: new Set() })}>
                Reset Filters
              </button>
            </div>
          ) : isAllOrlando ? (
            <>
              {/* ── Park Prodigy Recommended ────────────────────────────── */}
              {recommendedHotels.length > 0 && (
                <div className="recommended-section">
                  <div className="recommended-header">
                    <div className="recommended-badge">⭐ The Park Prodigy Recommended</div>
                    <p className="recommended-sub">Hand-picked by our team of theme park experts</p>
                  </div>
                  <div className="hotel-list">
                    {recommendedHotels.map((h: unknown) => {
                      const hotel = h as { id: string }
                      return (
                        <HotelCard
                          key={hotel.id}
                          hotel={h}
                          rate={rateMap[hotel.id]}
                          checkin={checkin}
                          checkout={checkout}
                          onClick={() => handleSelectHotel(hotel.id)}
                          pricesHidden={searchDirty}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Show More Deals ─────────────────────────────────────── */}
              {remainingHotels.length > 0 && (
                <>
                  {!showMore ? (
                    <div className="show-more-wrap">
                      <button className="show-more-btn" onClick={() => setShowMore(true)}>
                        Show More Deals ({remainingHotels.length} more hotels) ↓
                      </button>
                    </div>
                  ) : (
                    <div className="hotel-list" style={{ marginTop: 16 }}>
                      {remainingHotels.map((h: unknown) => {
                        const hotel = h as { id: string }
                        return (
                          <HotelCard
                            key={hotel.id}
                            hotel={h}
                            rate={rateMap[hotel.id]}
                            checkin={checkin}
                            checkout={checkout}
                            onClick={() => handleSelectHotel(hotel.id)}
                            pricesHidden={searchDirty}
                          />
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>

              <div className="hotel-list">
                {visible.map((h: unknown) => {
                  const hotel = h as { id: string }
                  return (
                    <HotelCard
                      key={hotel.id}
                      hotel={h}
                      rate={rateMap[hotel.id]}
                      checkin={checkin}
                      checkout={checkout}
                      onClick={() => handleSelectHotel(hotel.id)}
                      pricesHidden={searchDirty}
                    />
                  )
                })}
              </div>

              {/* ── Universal Hotels CTA ────────────────────────────────── */}
              {isUniversalFilter && !loading && (
                <div className="universal-cta">
                  <div className="universal-cta-inner">
                    <div className="universal-cta-icon">🏨</div>
                    <div className="universal-cta-text">
                      <strong>Don&apos;t see the hotel you&apos;re looking for?</strong>
                      <span>Shop more Universal Orlando hotel deals — including exclusive vacation packages with tickets.</span>
                    </div>
                    <a
                      href="https://theparkprodigy.com/discount-universal-orlando-vacation-packages/"
                      className="universal-cta-btn"
                      target="_parent"
                    >
                      View Package Deals →
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
