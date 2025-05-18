import React, { useEffect, useRef } from 'react';
import useGoogleMapsApi from '../../hooks/useGoogleMapsApi';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
  [key: string]: unknown;
}

const GoogleMap: React.FC<MapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  className,
  markers = [],
  ...rest
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<google.maps.Marker[]>([]);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const googleMapsApi = useGoogleMapsApi();

  useEffect(() => {
    if (googleMapsApi && mapRef.current && !mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom,
      });

      if (markers.length > 0) {
        markers.forEach(marker => {
          const newMarker = new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: mapInstance.current,
            title: marker.title,
          });
          markerRefs.current.push(newMarker);
        });
      } else {
        const newMarker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance.current,
        });
        markerRefs.current.push(newMarker);
      }
    } else if (mapInstance.current) {
      markerRefs.current.forEach(marker => marker.setMap(null));
      markerRefs.current = [];

      mapInstance.current.setCenter({ lat: latitude, lng: longitude });
      mapInstance.current.setZoom(zoom);

      if (markers.length > 0) {
        markers.forEach(marker => {
          const newMarker = new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: mapInstance.current,
            title: marker.title,
          });
          markerRefs.current.push(newMarker);
        });
      } else {
        const newMarker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance.current,
        });
        markerRefs.current.push(newMarker);
      }
    }
  }, [latitude, longitude, zoom, googleMapsApi, markers]);

  return (
    <div {...rest} className={`rounded-lg w-full h-full shadow-lg ${className}`} ref={mapRef} />
  );
};

export default GoogleMap;
