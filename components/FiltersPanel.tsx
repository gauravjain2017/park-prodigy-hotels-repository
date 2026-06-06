'use client'

import { useState } from 'react'
import { DESTINATIONS, SecondaryFilters, getSortedHotels, applySecondaryFilters, getNights } from '@/lib/hotels'

const AMENITY_DEFS = [
  { id: 'refundable', l: 'Refundable', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> },
  { id: 'pool', l: 'Pool', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3-2 4.5 0"/><path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/></svg> },
  { id: 'parking', l: 'Parking', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h5a3 3 0 0 1 0 6H9"/></svg> },
  { id: 'breakfast', l: 'Breakfast', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/></svg> },
  { id: 'wifi', l: 'Wi-Fi', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> },
  { id: 'kitchen', l: 'Kitchen', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg> },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FiltersPanel({ hotels, rateMap, dest, currentFilter, currentSort, filters, checkin, checkout, onFilterChange, onSortChange, onTypeFilterChange }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotels: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rateMap: Record<string, any>
  dest: string
  currentFilter: string
  currentSort: string
  filters: SecondaryFilters
  checkin: string
  checkout: string
  onFilterChange: (f: SecondaryFilters) => void
  onSortChange: (s: string) => void
  onTypeFilterChange: (id: string) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileFilters, setMobileFilters] = useState<SecondaryFilters>({ ...filters, amenities: new Set(filters.amenities) })

  const n = getNights(checkin, checkout)
  const destConfig = DESTINATIONS[dest]
  const sorted = getSortedHotels(hotels, rateMap, currentSort)
  const filtered = applySecondaryFilters(sorted, rateMap, n, filters)
  const progressPct = hotels.length > 0 ? Math.round(filtered.length / hotels.length * 100) : 100

  const activeFilterCount = [
    filters.stars !== 'all',
    filters.maxPrice < 1000,
    filters.refundableOnly,
    ...Array.from(filters.amenities).map(() => true),
  ].filter(Boolean).length

  function toggleAmenity(id: string) {
    const next = new Set(filters.amenities)
    next.has(id) ? next.delete(id) : next.add(id)
    onFilterChange({ ...filters, amenities: next })
  }

  function toggleMobileAmenity(id: string) {
    const next = new Set(mobileFilters.amenities)
    next.has(id) ? next.delete(id) : next.add(id)
    setMobileFilters({ ...mobileFilters, amenities: next })
  }

  function openMobile() {
    setMobileFilters({ ...filters, amenities: new Set(filters.amenities) })
    setMobileOpen(true)
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  function applyMobile() {
    onFilterChange(mobileFilters)
    closeMobile()
  }

  function resetMobile() {
    setMobileFilters({ maxPrice: 1000, stars: 'all', refundableOnly: false, amenities: new Set() })
  }

  const sliderPct = Math.round(((filters.maxPrice - 50) / (1000 - 50)) * 100)
  const sliderLabel = filters.maxPrice >= 1000 ? 'Any price' : `Up to $${filters.maxPrice}`

  const mobileSliderPct = Math.round(((mobileFilters.maxPrice - 50) / (1000 - 50)) * 100)
  const mobileSliderLabel = mobileFilters.maxPrice >= 1000 ? 'Any price' : `Up to $${mobileFilters.maxPrice}`

  const countLabel = filtered.length === hotels.length ? 'All hotels shown' : `of ${hotels.length} total`

  return (
    <>
      {/* ── Desktop filter card (hidden on mobile via CSS) ── */}
      <div className="fp-card">
        <div className="fp-row fp-row--top">
          {destConfig.filters.length > 0 && (
            <>
              <div className="fp-group">
                <span className="fp-label">TYPE</span>
                <div className="fp-pills">
                  {destConfig.filters.map(f => (
                    <button
                      key={f.id}
                      className={`fp-pill${currentFilter === f.id ? ' fp-pill--active' : ''}`}
                      onClick={() => onTypeFilterChange(f.id)}
                    >{f.label}</button>
                  ))}
                </div>
              </div>
              <div className="fp-vsep" />
            </>
          )}
          <div className="fp-group">
            <span className="fp-label">STARS</span>
            <div className="fp-pills">
              {[{ v: 'all', l: 'Any' }, { v: '3', l: '3★' }, { v: '4', l: '4★' }, { v: '5', l: '5★' }].map(o => (
                <button
                  key={o.v}
                  className={`fp-pill${filters.stars === o.v ? ' fp-pill--active' : ''}`}
                  onClick={() => onFilterChange({ ...filters, stars: o.v })}
                >{o.l}</button>
              ))}
            </div>
          </div>
          <div className="fp-vsep" />
          <div className="fp-group">
            <span className="fp-label">SORT</span>
            <div className="fp-pills">
              {[{ v: 'best', l: 'Best match' }, { v: 'price', l: 'Price' }, { v: 'rating', l: 'Rating' }].map(o => (
                <button
                  key={o.v}
                  className={`fp-pill${currentSort === o.v ? ' fp-pill--active' : ''}`}
                  onClick={() => onSortChange(o.v)}
                >{o.l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="fp-row fp-row--amenities">
          <div className="fp-group fp-group--price">
            <span className="fp-label">PRICE</span>
            <div className="fp-price-wrap">
              <input
                type="range" className="fp-slider"
                min={50} max={1000} step={25}
                value={filters.maxPrice}
                style={{ background: `linear-gradient(to right,#2872cc 0%,#2872cc ${sliderPct}%,#dde2ec ${sliderPct}%,#dde2ec 100%)` }}
                onChange={e => onFilterChange({ ...filters, maxPrice: +e.target.value })}
              />
              <span className="fp-price-val">{sliderLabel}</span>
            </div>
          </div>
          <div className="fp-pills fp-pills--amenities">
            {AMENITY_DEFS.map(a => {
              const active = a.id === 'refundable' ? filters.refundableOnly : filters.amenities.has(a.id)
              return (
                <button
                  key={a.id}
                  className={`fp-pill${active ? ' fp-pill--active' : ''}`}
                  onClick={() => {
                    if (a.id === 'refundable') onFilterChange({ ...filters, refundableOnly: !filters.refundableOnly })
                    else toggleAmenity(a.id)
                  }}
                >{a.l}</button>
              )
            })}
          </div>
        </div>

        <div className="fp-count-bar">
          <span className="fp-count-chip">
            <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill="currentColor"/></svg>
            {' '}{filtered.length} hotel{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="fp-progress-wrap">
            <div className="fp-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="fp-count-label">{countLabel}</span>
        </div>
      </div>

      {/* ── Mobile filter bar (visible only on ≤768px) ── */}
      <div className="mobile-filter-bar">
        {!mobileOpen ? (
          <div className="mfb-action-row">
            <button
              className={`mfb-filters-btn${activeFilterCount > 0 ? ' mfb-filters-btn--active' : ''}`}
              onClick={openMobile}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="mfb-fbadge">{activeFilterCount}</span>
              )}
            </button>
          </div>
        ) : (
          <div className="mfd-inline">
            <div className="mfd-header">
              <span className="mfd-title">Filters</span>
              <button className="mfd-close" onClick={closeMobile}>✕</button>
            </div>

            <div className="mfd-body">
              {destConfig.filters.length > 0 && (
                <div className="mfd-section">
                  <div className="mfd-section-title">Hotel Type</div>
                  <div className="mfd-pills">
                    {destConfig.filters.map(f => (
                      <button
                        key={f.id}
                        className={`fp-pill${currentFilter === f.id ? ' fp-pill--active' : ''}`}
                        onClick={() => { onTypeFilterChange(f.id); closeMobile() }}
                      >{f.label}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mfd-section">
                <div className="mfd-section-title">Star Rating</div>
                <div className="mfd-pills">
                  {[{ v: 'all', l: 'Any' }, { v: '3', l: '3★' }, { v: '4', l: '4★' }, { v: '5', l: '5★' }].map(o => (
                    <button
                      key={o.v}
                      className={`fp-pill${mobileFilters.stars === o.v ? ' fp-pill--active' : ''}`}
                      onClick={() => setMobileFilters({ ...mobileFilters, stars: o.v })}
                    >{o.l}</button>
                  ))}
                </div>
              </div>

              <div className="mfd-section">
                <div className="mfd-section-title">Max Price Per Night</div>
                <div className="mfd-slider-row">
                  <input
                    type="range" className="fp-slider mfd-full-slider"
                    min={50} max={1000} step={25}
                    value={mobileFilters.maxPrice}
                    style={{ background: `linear-gradient(to right,#2872cc 0%,#2872cc ${mobileSliderPct}%,#dde2ec ${mobileSliderPct}%,#dde2ec 100%)` }}
                    onChange={e => setMobileFilters({ ...mobileFilters, maxPrice: +e.target.value })}
                  />
                  <span className="mfd-price-val">{mobileSliderLabel}</span>
                </div>
              </div>

              <div className="mfd-section">
                <div className="mfd-section-title">Amenities</div>
                <div className="mfd-pills">
                  {AMENITY_DEFS.map(a => {
                    const active = a.id === 'refundable' ? mobileFilters.refundableOnly : mobileFilters.amenities.has(a.id)
                    return (
                      <button
                        key={a.id}
                        className={`fp-pill mfd-amenity-pill${active ? ' fp-pill--active' : ''}`}
                        onClick={() => {
                          if (a.id === 'refundable') setMobileFilters({ ...mobileFilters, refundableOnly: !mobileFilters.refundableOnly })
                          else toggleMobileAmenity(a.id)
                        }}
                      >
                        <span className="mfd-amenity-icon">{a.icon}</span>
                        {a.l}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mfd-footer">
              <button className="mfd-btn-reset" onClick={resetMobile}>Reset all</button>
              <button className="mfd-btn-apply" onClick={applyMobile}>Show results</button>
            </div>
          </div>
        )}

        <div className="mfb-count-bar">
          <span className="mfb-count-chip">
            <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill="currentColor"/></svg>
            {' '}{filtered.length} hotel{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="mfb-count-progress">
            <div className="mfb-count-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="mfb-count-total">{countLabel}</span>
        </div>
      </div>
    </>
  )
}
