import { getNearbyAttractions, travelLabel } from '@/lib/attractions'

export function NearbyAttractions({ lat, lng, address }: { lat: number; lng: number; address: string }) {
  const nearby = getNearbyAttractions(lat, lng)
  if (!nearby.length) return null

  const mapUrl = `https://maps.google.com/?q=${lat},${lng}`
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.03},${lat - 0.02},${lng + 0.03},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="price-summary-side">
      <div className="section-title">Explore the area</div>
      <div className="card card-flush">
        <iframe src={osmUrl} className="map-iframe" loading="lazy" />
        <div className="nearby-wrap">
          <div className="nearby-address">📍 {address}</div>
          {nearby.map(a => {
            const t = travelLabel(a.miles)
            return (
              <div className="nearby-row" key={a.name}>
                <span className="nearby-icon">{a.icon}</span>
                <span className="nearby-name">{a.name}</span>
                <span className="nearby-distance">{t.icon} {t.label}</span>
              </div>
            )
          })}
          <a href={mapUrl} target="_blank" rel="noreferrer" className="nearby-link">
            View in Google Maps →
          </a>
        </div>
      </div>
    </div>
  )
}
