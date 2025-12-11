/**
 * Geo utilities
 * - `haversineKm(a, b)`: distance in km between two {lat, lon} points.
 * - `clamp(v, min, max)`: clamp numeric value.
 */
export const R_EARTH_KM = 6371;
export function haversineKm(a, b) {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R_EARTH_KM * Math.asin(Math.sqrt(x));
}
export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
