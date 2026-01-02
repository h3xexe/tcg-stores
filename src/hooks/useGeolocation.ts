import { useCallback, useState } from 'react';
import type { Coordinates } from '../utils/distance';

export type LocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';

interface UseGeolocationReturn {
  location: Coordinates | null;
  status: LocationStatus;
  error: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
  setManualLocation: (coords: Coordinates) => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Tarayıcınız konum özelliğini desteklemiyor');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('success');
        setError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setError('Konum izni reddedildi');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setStatus('error');
          setError('Konum bilgisi alınamadı');
        } else if (err.code === err.TIMEOUT) {
          setStatus('error');
          setError('Konum isteği zaman aşımına uğradı');
        } else {
          setStatus('error');
          setError('Konum alınırken bir hata oluştu');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setStatus('idle');
    setError(null);
  }, []);

  const setManualLocation = useCallback((coords: Coordinates) => {
    setLocation(coords);
    setStatus('success');
    setError(null);
  }, []);

  return {
    location,
    status,
    error,
    requestLocation,
    clearLocation,
    setManualLocation,
  };
}
