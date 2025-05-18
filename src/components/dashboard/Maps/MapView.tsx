import React, { useMemo, useState, useEffect } from 'react';
import GoogleMap from '../../common/Map';
import { useContact } from '../../../hooks/useContact';

interface MapViewProps {
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ className = '' }) => {
  const { contacts, selectedContact } = useContact();
  const [zoom, setZoom] = useState(12);

  // Aumenta o zoom quando um contato é selecionado
  useEffect(() => {
    if (selectedContact?.latitude && selectedContact?.longitude) {
      setZoom(17); // Zoom maior quando um contato é selecionado
    } else {
      setZoom(12); // Zoom normal para visualização geral
    }
  }, [selectedContact]);

  const markers = useMemo(() => {
    return contacts
      .filter(contact => contact.latitude && contact.longitude)
      .map(contact => ({
        lat: contact.latitude!,
        lng: contact.longitude!,
        title: contact.name,
      }));
  }, [contacts]);

  const mapCenter = useMemo(() => {
    if (selectedContact?.latitude && selectedContact?.longitude) {
      return {
        lat: selectedContact.latitude,
        lng: selectedContact.longitude,
      };
    }

    if (markers.length > 0) {
      return {
        lat: markers[0].lat,
        lng: markers[0].lng,
      };
    }

    return {
      lat: -23.5505,
      lng: -46.6333,
    };
  }, [selectedContact, markers]);

  return (
    <div className={`border bg-white p-4 rounded-lg ${className}`}>
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold">
          {selectedContact ? `Localização de ${selectedContact.name}` : 'Mapa de Contatos'}
        </h2>
      </div>
      <div className="h-[calc(100%-60px)] flex items-center justify-center">
        {selectedContact || markers.length > 0 ? (
          <GoogleMap
            latitude={mapCenter.lat}
            longitude={mapCenter.lng}
            zoom={zoom}
            markers={markers}
            className="w-full h-full"
          />
        ) : (
          <span className="text-gray-500 text-lg">
            Nenhum contato selecionado ou cadastrado. Adicione um contato para visualizar o mapa.
          </span>
        )}
      </div>
    </div>
  );
};

export default MapView;
