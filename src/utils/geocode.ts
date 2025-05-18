import { handleError } from './errorHandler';

export const geocodeAddress = async (address: string) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;

      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }
    return null;
  } catch (error) {
    handleError(error, 'Erro ao obter coordenadas');
    return null;
  }
};
