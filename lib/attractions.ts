export type Attraction = { name: string; lat: number; lng: number; icon: string }

export const ATTRACTIONS: Attraction[] = [
  { name: 'Magic Kingdom', lat: 28.4177, lng: -81.5812, icon: '🏰' },
  { name: 'Universal Studios Florida', lat: 28.4789, lng: -81.4673, icon: '🎬' },
  { name: 'Universal Islands of Adventure', lat: 28.4715, lng: -81.468, icon: '🎢' },
  { name: 'Universal Epic Universe', lat: 28.42, lng: -81.47, icon: '✨' },
  { name: 'EPCOT', lat: 28.3747, lng: -81.5494, icon: '🌍' },
  { name: 'Disney Hollywood Studios', lat: 28.3576, lng: -81.5609, icon: '🎭' },
  { name: 'Disney Animal Kingdom', lat: 28.3553, lng: -81.59, icon: '🦁' },
  { name: 'SeaWorld Orlando', lat: 28.412, lng: -81.4619, icon: '🐬' },
  { name: 'Disneyland Park', lat: 33.8121, lng: -117.919, icon: '🏰' },
  { name: 'Disney California Adventure', lat: 33.8091, lng: -117.9187, icon: '🎡' },
  { name: 'Universal Studios Hollywood', lat: 34.1381, lng: -118.3534, icon: '🎬' },
  { name: 'Orlando Intl Airport', lat: 28.4312, lng: -81.3081, icon: '✈️' },
  { name: 'Los Angeles Intl Airport', lat: 33.9416, lng: -118.4085, icon: '✈️' },
  { name: 'Anaheim Convention Center', lat: 33.8003, lng: -117.9193, icon: '🏛️' },
]

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}


export function travelLabel(miles: number): { label: string; icon: string } {
  if (miles < 0.3) return { label: '2 min walk', icon: '🚶' }
  if (miles < 0.8) return { label: `${Math.round(miles * 20)} min walk`, icon: '🚶' }
  if (miles < 1.5) return { label: `${Math.round(miles * 3)} min drive`, icon: '🚗' }
  return { label: `${Math.round(miles * 2)} min drive`, icon: '🚗' }
}


export function getNearbyAttractions(lat: number, lng: number, maxMiles = 30, limit = 6) {
  return ATTRACTIONS
    .map(a => ({ ...a, miles: haversineDistance(lat, lng, a.lat, a.lng) }))
    .filter(a => a.miles < maxMiles)
    .sort((a, b) => a.miles - b.miles)
    .slice(0, limit)
}
