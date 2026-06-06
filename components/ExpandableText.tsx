import { getHotelDetail, getRates } from '@/lib/liteapi'
import {
  isUniversalOnsite, getAdjustedTotal, fmtPrice, getNights,
  getRoomName, getTaxInfo,
} from '@/lib/hotels'
import { NearbyAttractions } from '@/components/NearbyAttractions'
import { RoomCard } from '@/components/RoomCard'
import { ExpandableText } from '@/components/ExpandableText'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ checkin?: string; checkout?: string; adults?: string; rooms?: string; childAges?: string }>
}

export default async function HotelDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const sp = await searchParams
  const checkin = sp.checkin ?? ''
  const checkout = sp.checkout ?? ''
  const adults = parseInt(sp.adults ?? '2', 10)
  const rooms = parseInt(sp.rooms ?? '1', 10)
  const childAges = sp.childAges ? sp.childAges.split(',').map(Number) : []

  if (!checkin || !checkout || !id) {
    return (
      <div className="detail-page">
        <p className="error-box">Missing hotel or date parameters. <Link href="/">Back to search</Link></p>
      </div>
    )
  }

  const occupancies = Array.from({ length: rooms }, () => {
    const occ: { adults: number; children?: number[] } = { adults }
    if (childAges.length) occ.children = childAges
    return occ
  })

  const [detailResult, ratesResult] = await Promise.allSettled([
    getHotelDetail(id),
    getRates({ hotelIds: [id], checkin, checkout, occupancies }),
  ])

  if (detailResult.status === 'rejected') {
    return (
      <div className="detail-page">
        <p className="error-box">Failed to load hotel details. <Link href="/">Back to search</Link></p>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const h: any = detailResult.value?.data ?? {}
  if (!h.name) {
    return (
      <div className="detail-page">
        <p className="error-box">Hotel not found. <Link href="/">Back to search</Link></p>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allRooms: any[] = []
  if (ratesResult.status === 'fulfilled') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rData = ratesResult.value?.data ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const match = rData.find((hr: any) => hr.hotelId === id)
    allRooms = match?.roomTypes ?? []
  }

  const onsite = isUniversalOnsite(h.name ?? '')
  const numNights = getNights(checkin, checkout)
  const detailRooms = h.rooms ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allRooms = allRooms.map((rm: any) => ({ ...rm, resolvedRoomName: getRoomName(rm, detailRooms) }))
  allRooms.sort((a, b) => {
    const aT = getAdjustedTotal({ name: h.name }, a) ?? Infinity
    const bT = getAdjustedTotal({ name: h.name }, b) ?? Infinity
    return aT - bT
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images: any[] = [...(h.hotelImages ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const mainImg = images[0]?.url ?? ''
  const thumbs = images.slice(1, 5)

  const facilities: string[] = (h.hotelFacilities ?? []).slice(0, 16)

  const rawDesc = (h.hotelDescription ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  const cin = h.checkinCheckoutTimes?.checkin ?? h.checkinCheckoutTimes?.checkinStart ?? ''
  const cout = h.checkinCheckoutTimes?.checkout ?? ''
  const importantInfo = (h.hotelImportantInformation ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const addrFull = [h.address, h.city, h.country ? h.country.toUpperCase() : ''].filter(Boolean).join(', ')
  const lat = h.location?.latitude ?? null
  const lng = h.location?.longitude ?? null

  let cheapestTotal: number | null = null
  for (const rm of allRooms) {
    const adj = getAdjustedTotal({ name: h.name }, rm)
    if (adj !== null && (cheapestTotal === null || adj < cheapestTotal)) cheapestTotal = adj
  }
  const perNight = cheapestTotal && numNights ? Math.round(cheapestTotal / numNights) : null

  const hotelData = {
    hotelId: id,
    hotelName: h.name ?? '',
    hotelImage: mainImg,
    checkin,
    checkout,
    adults,
    rooms,
    detailRooms,
    hotelImages: images,
  }

  const backUrl = `/?checkin=${checkin}&checkout=${checkout}&adults=${adults}&rooms=${rooms}`

  return (
    <div className="detail-page">
      <div style={{ marginBottom: 16 }}>
        <Link href={backUrl} style={{ color: 'var(--blue)', fontSize: 14, fontWeight: 600 }}>
          ← Back to results
        </Link>
      </div>

      {/* Gallery */}
      <div className="gallery">
        <div className="gallery-main">
          {mainImg
            ? <img src={mainImg} alt={h.name} />
            : <div className="gallery-placeholder">🏨</div>
          }
        </div>
        {thumbs.map((img, i) => (
          <div key={i}>
            <img src={img.url ?? ''} alt={img.caption ?? ''} onError={undefined} />
          </div>
        ))}
        {Array.from({ length: Math.max(0, 4 - thumbs.length) }, (_, i) => (
          <div key={`ph-${i}`} className="gallery-placeholder gallery-placeholder--sm" />
        ))}
      </div>

      {/* Hotel heading */}
      <div className="detail-layout detail-layout--single">
        <div>
          <div className="detail-mb">
            <h1 className="detail-heading">{h.name}</h1>
            <div className="detail-meta-row">
              {h.starRating ? <span className="stars" style={{ fontSize: 20 }}>{'★'.repeat(Math.min(5, Math.floor(h.starRating)))}</span> : null}
              {h.rating ? (
                <span className="rating-badge">
                  ★ {h.rating}
                  {h.reviewCount ? <span className="rating-badge-reviews">({Number(h.reviewCount).toLocaleString()} reviews)</span> : null}
                </span>
              ) : null}
            </div>
          </div>
          {addrFull && <div className="detail-address">📍 {addrFull}</div>}

          {rawDesc && (
            <>
              <div className="section-title">About this hotel</div>
              <div className="card card-compact desc-card" style={{ marginBottom: 16 }}>
                <ExpandableText text={rawDesc} limit={500} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Price summary + nearby */}
      <div className="card card-spaced">
        <div className="price-summary">
          <div className="price-summary-main">
            {facilities.length > 0 && (
              <>
                <div className="section-title">Facilities</div>
                <div className="facility-grid" style={{ marginBottom: 16 }}>
                  {facilities.map((f, i) => <span key={i} className="facility-tag">{f}</span>)}
                </div>
              </>
            )}

            {(cin || cout || importantInfo) && (
              <>
                <div className="section-title">Hotel policies</div>
                <div className="card card-compact" style={{ marginBottom: 16 }}>
                  {cin && <div className="policy-row"><span className="policy-row-label">Check-in</span><span className="policy-row-value">{cin}</span></div>}
                  {cout && <div className="policy-row"><span className="policy-row-label">Check-out</span><span className="policy-row-value">{cout}</span></div>}
                  {importantInfo && (
                    <div className="policy-important">
                      <div className="policy-important-title">Important information</div>
                      <ExpandableText text={importantInfo} limit={300} className="policy-important-text" />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="section-title">
              <div className="hotelroomprice-div">
                <div className="price-dates">
                  {new Date(checkin).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} →{' '}
                  {new Date(checkout).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} · {numNights} night{numNights !== 1 ? 's' : ''}
                </div>
                <div className="price-guests">{adults} adult{adults > 1 ? 's' : ''} · {rooms} room{rooms > 1 ? 's' : ''}</div>
                {perNight ? (
                  <>
                    <div className="price-big">{fmtPrice(perNight)}<span className="price-big-unit">/night</span></div>
                    <div className="price-sub">{fmtPrice(cheapestTotal)} total</div>
                    <div className="price-tax-wrap">
                      {onsite
                        ? <span className="tax-note-inline">✓ taxes incl.</span>
                        : allRooms.length > 0
                          ? (() => {
                              const ti = getTaxInfo(allRooms[0])
                              return ti.allIncluded
                                ? <span className="tax-note-inline">✓ taxes incl. · resort fees may apply</span>
                                : <span className="tax-note-inline--gold">+ {fmtPrice(ti.extraTotal)} due at property</span>
                            })()
                          : null
                      }
                    </div>
                  </>
                ) : (
                  <div className="price-unavailable">Price unavailable</div>
                )}
              </div>
            </div>
          </div>

          {lat && lng && (
            <NearbyAttractions lat={lat} lng={lng} address={addrFull} />
          )}
        </div>
      </div>

      {/* Room list */}
      <div className="mt-sm">
        <div className="section-title section-title--lg">Available rooms</div>
        <div id="inline-room-list">
          {allRooms.length === 0 ? (
            <p className="no-rooms-msg">No rooms available for selected dates.</p>
          ) : (
            <div className="room-list">
              {allRooms.map((rm, i) => (
                <RoomCard
                  key={rm.offerId ?? i}
                  room={rm}
                  index={i}
                  hotelData={hotelData as never}
                  numNights={numNights}
                  isOnsite={onsite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
