'use client'

import { getAdjustedTotal, getTaxInfo, getCancelPolicy, getDiscountPct, hasNoResortFee, isUniversalOnsite, fmtPrice, getNights } from '@/lib/hotels'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HotelCard({ hotel, rate, checkin, checkout, onClick, pricesHidden }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotel: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rate?: any
  checkin: string
  checkout: string
  onClick?: () => void
  pricesHidden?: boolean
}) {
  const n = getNights(checkin, checkout)
  const total = getAdjustedTotal(hotel, rate)
  const perNight = total && n ? Math.round(total / n) : null
  const hasRate = !!total

  const photo = hotel.main_photo ?? hotel.mainPhoto ?? hotel.thumbnail ?? ''
  const addr = [hotel.address?.city ?? hotel.city, hotel.address?.state].filter(Boolean).join(', ')
  const desc = (hotel.hotelDescription ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const rating = hotel.rating ?? hotel.guestScore
  const reviewCount = hotel.reviewCount ?? hotel.numberOfReviews ?? 0
  const ratingLabel = rating >= 9 ? 'Exceptional' : rating >= 8 ? 'Wonderful' : rating >= 7 ? 'Good' : rating >= 6 ? 'Pleasant' : ''

  const cancelPolicy = getCancelPolicy(rate)
  const isRefundable = cancelPolicy?.refundableTag === 'RFN'
  const taxInfo = rate ? getTaxInfo(rate) : null
  const discountPct = rate ? getDiscountPct(rate) : null
  const onsite = isUniversalOnsite(hotel.name ?? '')
  const noresortfee = hasNoResortFee(hotel.name ?? '')

  // Tax note logic:
  // 1. Universal onsite → always "✓ taxes incl."
  // 2. Drury Plaza → "✓ No resort fees"
  // 3. Known extra fees → "+ $X due at property"
  // 4. Known all included → "✓ taxes incl."
  // 5. Unknown (null) → "resort fees may apply"
  let taxNote = ''
  let taxNoteClass = 'price-tax-note'
  if (rate && hasRate) {
    if (onsite) {
      taxNote = '✓ taxes incl.'
    } else if (noresortfee) {
      taxNote = '✓ No resort fees'
    } else if (taxInfo && taxInfo.extraFees.length > 0) {
      const extraPerNight = n > 0 ? Math.round(taxInfo.extraTotal / n) : taxInfo.extraTotal
      taxNote = `+ ${fmtPrice(extraPerNight)}/night resort fee due at property`
      taxNoteClass = 'price-tax-extra'
    } else if (taxInfo?.known && taxInfo.allIncluded) {
      taxNote = '✓ taxes incl. · resort fees may apply'
    } else {
      // null returned — unknown
      taxNote = 'Resort fees may apply'
      taxNoteClass = 'price-tax-unknown'
    }
  }

  return (
    <div
      className={`hotel-card${!pricesHidden && !hasRate ? ' no-rate' : ''}${pricesHidden ? ' prices-stale' : ''}`}
      onClick={hasRate && !pricesHidden ? onClick : undefined}
      style={{ cursor: hasRate && !pricesHidden ? 'pointer' : 'default' }}
    >
      <div className="hotel-card-inner">
        <div className="hotel-img">
          {photo
            ? <img src={photo} alt={hotel.name ?? 'Hotel'} loading="lazy" onError={e => { (e.target as HTMLElement).parentElement!.innerHTML = '<div class="hotel-img-placeholder">🏨</div>' }} />
            : <div className="hotel-img-placeholder">🏨</div>
          }
        </div>
        <div className="hotel-body">
          <div className="hotel-info">
            <div className="hotel-name">{hotel.name ?? 'Hotel'}</div>
            <div className="hotel-location">
              {hotel.stars ? <span className="stars">{'★'.repeat(Math.min(5, Math.floor(hotel.stars)))}</span> : null}
              {' '}{addr}
            </div>
            {desc && <div className="hotel-desc">{desc.slice(0, 200)}</div>}
            {isRefundable && <div className="refund-tag">✓ Fully refundable options</div>}
            {rating ? (
              <div className="hotel-rating">
                <span className="rating-score">{rating}</span>
                {ratingLabel && <span className="rating-label">{ratingLabel}</span>}
                {reviewCount > 0 && <span className="rating-count">{reviewCount.toLocaleString()} reviews</span>}
              </div>
            ) : null}
          </div>
          <div className="hotel-price">
            {pricesHidden ? (
              <div className="stale-price-notice">
                <div className="stale-price-icon">↻</div>
                <div className="stale-price-text">Search to<br/>update prices</div>
              </div>
            ) : hasRate ? (
              <>
                {discountPct && discountPct > 0 && (
                  <div className="discount-badge">{discountPct}% off</div>
                )}
                <div className="price-per-night">{fmtPrice(perNight)} &nbsp;nightly</div>
                <div className="price-total">{fmtPrice(total)} &nbsp;total</div>
                {taxNote && <div className={taxNoteClass}>{taxNote}</div>}
              </>
            ) : (
              <div className="no-rates-text">
                No rates available.{' '}
                {isUniversalOnsite(hotel.name ?? '') ? (
                  <a href="https://theparkprodigy.com/discount-universal-orlando-vacation-packages/" target="_blank" rel="noreferrer" style={{ color: '#2872cc', fontWeight: 600 }}>
                    Check our vacation package page →
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
