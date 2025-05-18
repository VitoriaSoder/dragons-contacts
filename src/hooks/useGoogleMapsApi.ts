import { useState, useEffect, useCallback } from 'react';

let googleMapsApi: typeof google.maps | null = null;
let loading = false;
const callbacks: (() => void)[] = [];

const useGoogleMapsApi = (): typeof google.maps | null => {
  const [api, setApi] = useState<typeof google.maps | null>(null);

  const handleApiLoaded = useCallback(() => {
    if (window.google?.maps) {
      setApi(window.google.maps);
    }
  }, []);

  useEffect(() => {
    if (googleMapsApi) {
      setApi(googleMapsApi);
    } else if (loading) {
      callbacks.push(handleApiLoaded);
    } else {
      loading = true;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        if (window.google?.maps) {
          googleMapsApi = window.google.maps;
          loading = false;
          setApi(window.google.maps);
          callbacks.forEach(cb => cb());
          callbacks.length = 0;
        }
      };
      document.head.appendChild(script);
    }
  }, [handleApiLoaded]);

  return api;
};

export default useGoogleMapsApi;
