const EARTH_RADIUS_MILES = 3958.8;

// Haversine formula — returns distance in miles between two lat/lon points
export function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Wraps the browser Geolocation API in a Promise
export function getCurrentPosition(timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('UNSUPPORTED'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: 30000,
    });
  });
}

export function geoErrorMessage(err) {
  if (!err) return 'Location check failed.';
  if (err.message === 'UNSUPPORTED')
    return 'Your browser does not support location services.';
  switch (err.code) {
    case 1: // PERMISSION_DENIED
      return 'Location permission was denied. Please allow location access in your browser settings and try again.';
    case 2: // POSITION_UNAVAILABLE
      return 'Your location could not be determined. Please check your GPS or Wi-Fi and try again.';
    case 3: // TIMEOUT
      return 'Location request timed out. Please try again.';
    default:
      return 'Could not get your location. Please try again.';
  }
}
