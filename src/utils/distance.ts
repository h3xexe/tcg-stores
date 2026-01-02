export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Haversine formula to calculate distance between two points
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Turkish city coordinates for manual selection
export const CITY_COORDINATES: Record<string, Coordinates> = {
  'İstanbul': { latitude: 41.0082, longitude: 28.9784 },
  'Ankara': { latitude: 39.9334, longitude: 32.8597 },
  'İzmir': { latitude: 38.4237, longitude: 27.1428 },
  'Antalya': { latitude: 36.8969, longitude: 30.7133 },
};
