import { getAdjustedTotal, getTaxInfo, getCancelPolicy, fmtPrice, getNights } from '@/lib/hotels'

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

  let taxNote = ''
  if (rate) {
    if (total && hotel.name && hotel.name.toLowerCase().match(/portofino bay|hard rock hotel|royal pacific|sapphire falls|helios grand|aventura hotel|stella nova|terra luna|cabana bay|endless summer/)) {
      taxNote = '✓ taxes incl.'
    } else if (taxInfo?.allIncluded) {
      taxNote = '✓ taxes incl. · resort fees may apply'
    } else if (taxInfo?.extraTotal) {
      taxNote = `+ ${fmtPrice(taxInfo.extraTotal)} due at property`
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
                <div className="price-per-night">{fmtPrice(perNight)} &nbsp;nightly</div>
                <div className="price-total">{fmtPrice(total)} &nbsp;total</div>
                {taxNote && <div className={taxNote.startsWith('+') ? 'price-tax-extra' : 'price-tax-note'}>{taxNote}</div>}
              </>
            ) : (
              <div className="no-rates-text">{rate === undefined ? 'Loading...' : 'No rates'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
