'use client'

import { useState } from 'react'
import { fmtPrice, getTaxInfo, getRoomName, getRoomPhoto, getRoomBeds, getRoomDescription, getRoomAmenities } from '@/lib/hotels'
import { CancellationPolicy } from './CancellationPolicy'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RoomCard({ room, index, hotelData, numNights, isOnsite }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room: any
  index: number
  hotelData: {
    hotelId: string
    hotelName: string
    hotelImage: string
    checkin: string
    checkout: string
    adults: number
    rooms: number
  }
  numNights: number
  isOnsite: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailRooms?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotelImages?: any[]
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const detailRooms = (hotelData as unknown as { detailRooms?: unknown[] }).detailRooms as unknown[] ?? []
  const hotelImages = (hotelData as unknown as { hotelImages?: unknown[] }).hotelImages as unknown[] ?? []

  const rawTotal = room.offerRetailRate?.amount
  const total = rawTotal ? (isOnsite ? Math.round(rawTotal * 0.96 * 100) / 100 : rawTotal) : null
  const perNight = total && numNights ? Math.round(total / numNights) : null

  const photo = getRoomPhoto(room, detailRooms as never[], hotelImages as never[])
  const roomName = getRoomName(room, detailRooms as never[])
  const beds = getRoomBeds(room, detailRooms as never[])
  const desc = getRoomDescription(room, detailRooms as never[])
  const amenities = getRoomAmenities(room, detailRooms as never[])
  const taxInfo = getTaxInfo(room)

  function handleSelect() {
    if (!room.offerId) return
    setLoading(true)
    setError('')

    // Listen for the cart response from the WordPress parent page
    const handler = (e: MessageEvent) => {
      if (!e.data || e.data.type !== 'liteapi_cart_response') return
      window.removeEventListener('message', handler)
      setLoading(false)
      if (!e.data.success) {
        setError(e.data.message || 'Failed to add room to cart.')
      }
      // On success the parent page redirects — nothing more to do here
    }
    window.addEventListener('message', handler)

    // Safety timeout in case parent never responds
    setTimeout(() => {
      window.removeEventListener('message', handler)
      setLoading(false)
    }, 15000)

    window.parent.postMessage(
      {
        type: 'ROOM_SELECTED',
        payload: {
          offerId: room.offerId,
          hotelId: hotelData.hotelId,
          hotelName: hotelData.hotelName,
          hotelImage: hotelData.hotelImage,
          roomName,
          boardName: room.rates?.[0]?.boardName ?? room.boardName ?? '',
          price: total ?? 0,
          perNight: perNight ?? 0,
          checkin: hotelData.checkin,
          checkout: hotelData.checkout,
          adults: hotelData.adults,
          rooms: hotelData.rooms,
          totalNights: numNights,
        },
      },
      '*'
    )
  }

  return (
    <div className="room-list-row" id={`iroom-${index}`}>
      {photo ? (
        <div className="room-list-img">
          <img src={photo} alt={roomName} onError={e => { (e.target as HTMLElement).parentElement!.innerHTML = '<div class="room-list-img-placeholder">🛏</div>' }} />
        </div>
      ) : (
        <div className="room-list-img-placeholder">🛏</div>
      )}

      <div className="room-list-info">
        <div className="room-list-name">{roomName}</div>
        {beds && <div className="room-list-beds">🛏 {beds}</div>}
        {room.boardName && <span className="room-list-board">{room.boardName}</span>}
        {desc && <div className="room-list-desc">{desc.slice(0, 180)}{desc.length > 180 ? '...' : ''}</div>}
        {amenities.length > 0 && <div className="room-list-amenities">{amenities.join(' · ')}</div>}
        <div className="room-list-policy">
          <CancellationPolicy rate={room} />
          {isOnsite ? (
            <div className="tax-included">✓ All taxes &amp; fees included</div>
          ) : taxInfo.allIncluded ? (
            <div className="tax-included">✓ All taxes &amp; fees included</div>
          ) : (
            <>
              <div className="tax-extra">+ {fmtPrice(taxInfo.extraTotal)} due at property</div>
              <div className="tax-extra-desc">{taxInfo.extraFees.map((f: {description?: string}) => f.description ?? 'Fee').join(', ')}</div>
            </>
          )}
        </div>
      </div>

      <div className="room-list-price">
        {perNight ? (
          <>
            <div className="room-list-price-night">{fmtPrice(perNight)}<span>/night</span></div>
            <div className="room-list-price-total">{fmtPrice(total)} total</div>
            <div className="room-list-price-tax">
              {isOnsite
                ? <span className="tax-note-inline">✓ taxes incl.</span>
                : taxInfo.allIncluded
                  ? <span className="tax-note-inline">✓ taxes incl. · resort fees may apply</span>
                  : <span className="tax-note-inline--gold">+ {fmtPrice(taxInfo.extraTotal)} due at property</span>
              }
            </div>
          </>
        ) : (
          <div className="slide-no-rate">Price unavailable</div>
        )}
        <button className="room-list-btn" onClick={handleSelect} disabled={loading || !perNight}>
          {loading ? 'Adding to cart...' : 'Select This Room →'}
        </button>
        {error && <div className="error-box" style={{ marginTop: 8, fontSize: 13 }}>{error}</div>}
      </div>
    </div>
  )
}
