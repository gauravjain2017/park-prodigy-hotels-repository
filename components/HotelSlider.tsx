'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { getAdjustedTotal, getTaxInfo, getDiscountPct, isUniversalOnsite, hasNoResortFee, getNights, fmtPrice } from '@/lib/hotels'

const NAV_PREV = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const NAV_NEXT = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function ratingLabel(r: number) {
  if (r >= 9) return 'Exceptional'
  if (r >= 8) return 'Wonderful'
  if (r >= 7) return 'Good'
  if (r >= 6) return 'Pleasant'
  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SlideCard({ hotel, rate, numNights, onClick, pricesHidden }: { hotel: any; rate: any; numNights: number; onClick: () => void; pricesHidden?: boolean }) {
  const h = hotel
  const name: string = h.name ?? 'Hotel'
  const addr = [(h.address?.city ?? h.city), (h.address?.state)].filter(Boolean).join(', ')
  const desc = ((h.hotelDescription ?? '') as string).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const photo: string = h.main_photo ?? h.mainPhoto ?? h.thumbnail ?? ''
  const stars: number = Math.min(5, Math.floor(h.stars ?? h.starRating ?? 0))
  const rating: number | null = h.rating ?? h.guestScore ?? null
  const reviewCount: number = h.reviewCount ?? h.numberOfReviews ?? 0

  const total = rate ? getAdjustedTotal({ name }, rate) : null
  const perNight = total && numNights ? Math.round(total / numNights) : null
  const hasRate = !!total
  const onsite = isUniversalOnsite(name)
  const noresortfee = hasNoResortFee(name)
  const discountPct = rate ? getDiscountPct(rate) : null

  const cancelPolicy = rate?.rates?.[0]?.cancellationPolicies
    ?? rate?.rates?.[0]?.cancelPolicy
    ?? rate?.cancellationPolicies
    ?? rate?.cancelPolicy
  const isRefundable = cancelPolicy?.refundableTag === 'RFN'

  let taxNote: React.ReactNode = null
  if (hasRate) {
    if (onsite) {
      taxNote = <div className="slide-tax-note">✓ taxes incl.</div>
    } else if (noresortfee) {
      taxNote = <div className="slide-tax-note">✓ No resort fees</div>
    } else if (rate) {
      const ti = getTaxInfo(rate)
      if (ti.extraFees.length > 0) {
        const extraPerNight = numNights > 0 ? Math.round(ti.extraTotal / numNights) : ti.extraTotal
        taxNote = <div className="slide-tax-extra">+ {fmtPrice(extraPerNight)}/night resort fee at property</div>
      } else if (ti.known && ti.allIncluded) {
        taxNote = <div className="slide-tax-note">✓ taxes incl. · resort fees may apply</div>
      } else {
        // null — unknown
        taxNote = <div className="slide-tax-unknown">Resort fees may apply</div>
      }
    }
  }

  return (
    <div className={`hotel-card-slide${!pricesHidden && !hasRate ? ' no-rate' : ''}${pricesHidden ? ' prices-stale' : ''}`} onClick={hasRate && !pricesHidden ? onClick : undefined}>
      <div className="slide-img-wrap">
        {photo
          ? <img className="slide-img" src={photo} alt={name} loading="lazy" />
          : <div className="slide-img-placeholder">🏨</div>
        }
        {discountPct && discountPct > 0 && !pricesHidden && (
          <div className="slide-discount-badge">{discountPct}% off</div>
        )}
      </div>
      <div className="slide-body">
        <div className="slide-meta">
          {stars > 0 && <span className="slide-stars">{'★'.repeat(stars)}</span>}
          <span className="slide-location">{addr}</span>
        </div>
        <div className="slide-name">{name}</div>
        {desc && <div className="slide-desc">{desc.slice(0, 150)}</div>}

        {isRefundable && (
          <div className="slide-refund">✓ Fully refundable</div>
        )}

        {rating !== null && (
          <div className="slide-rating-row">
            <span className="slide-rating-score">{rating}</span>
            {ratingLabel(rating) && <span className="slide-rating-label">{ratingLabel(rating)}</span>}
            {reviewCount > 0 && <span className="slide-rating-count">· {Number(reviewCount).toLocaleString()} reviews</span>}
          </div>
        )}

        <div className="slide-price-section">
          {pricesHidden ? (
            <div className="slide-stale-price">↻ Search to update prices</div>
          ) : hasRate ? (
            <>
              <div className="slide-price-night">{fmtPrice(perNight!)}<span> /night</span></div>
              <div className="slide-price-total">{fmtPrice(total!)} total</div>
              {taxNote}
            </>
          ) : (
            <div className="slide-no-rate">No rates available</div>
          )}
        </div>

        <button className="slide-cta" disabled={pricesHidden || !hasRate} onClick={e => { e.stopPropagation(); if (hasRate && !pricesHidden) onClick() }}>
          {pricesHidden ? 'Update Search' : hasRate ? 'Select Hotel →' : 'No Availability'}
        </button>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HotelSlider({ hotels, rateMap, checkin, checkout, onSelect, pricesHidden }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotels: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rateMap: Record<string, any>
  checkin: string
  checkout: string
  onSelect: (id: string) => void
  pricesHidden?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(3)
  const trackRef = useRef<HTMLDivElement>(null)
  const numNights = getNights(checkin, checkout)

  useEffect(() => {
    function update() {
      const w = window.innerWidth
      setSlidesToShow(w <= 768 ? 1 : w <= 1024 ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, hotels.length - slidesToShow)

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(maxIndex, i + 1)), [maxIndex])

  useEffect(() => { setIndex(0) }, [hotels])

  const cardWidthPct = 100 / slidesToShow

  return (
    <div className="hotel-slick-wrap">
      <button
        type="button"
        className={`hotel-slick-arrow hotel-slick-prev${index === 0 ? ' slick-disabled' : ''}`}
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous"
      >{NAV_PREV}</button>

      <div style={{ overflow: 'hidden' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            transform: `translateX(-${index * cardWidthPct}%)`,
            transition: 'transform 0.42s cubic-bezier(.4,0,.2,1)',
          }}
        >
          {hotels.map((h, i) => (
            <div
              key={(h as { id: string }).id ?? i}
              style={{ flex: `0 0 ${cardWidthPct}%`, minWidth: 0, padding: '0 10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
            >
              <SlideCard
                hotel={h}
                rate={rateMap[(h as { id: string }).id]}
                numNights={numNights}
                onClick={() => onSelect((h as { id: string }).id)}
                pricesHidden={pricesHidden}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`hotel-slick-arrow hotel-slick-next${index >= maxIndex ? ' slick-disabled' : ''}`}
        onClick={next}
        disabled={index >= maxIndex}
        aria-label="Next"
      >{NAV_NEXT}</button>
    </div>
  )
}
