import React from 'react';
import Button from '../common/Button';
import Typography from '../common/Typography';
import FormField from '../common/FormField';
import type { ViaCepResponse } from '../../types/contact';

interface AddressSearchModalProps {
  onClose: () => void;
  isLoading: boolean;
  stateSearch: string;
  citySearch: string;
  streetSearch: string;
  setStateSearch: (value: string) => void;
  setCitySearch: (value: string) => void;
  setStreetSearch: (value: string) => void;
  onSearch: (e: React.FormEvent) => Promise<void>;
  addressResults: ViaCepResponse[];
  onSelectAddress: (address: ViaCepResponse) => void;
}

const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  onClose,
  isLoading,
  stateSearch,
  citySearch,
  streetSearch,
  setStateSearch,
  setCitySearch,
  setStreetSearch,
  onSearch,
  addressResults,
  onSelectAddress,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <Typography variant="h3" className="mb-4">
          Buscar por Localização
        </Typography>
        <form onSubmit={onSearch}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <FormField
              label="UF"
              name="stateSearch"
              value={stateSearch}
              onChange={e => setStateSearch(e.target.value)}
              maxLength={2}
              required
            />
            <FormField
              label="Cidade"
              name="citySearch"
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
              required
            />
            <FormField
              label="Rua"
              name="streetSearch"
              value={streetSearch}
              onChange={e => setStreetSearch(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" onClick={onClose} variant="secondary" className="px-4 py-2">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="px-4 py-2" disabled={isLoading}>
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </form>
        {addressResults.length > 0 && (
          <div className="mt-4 max-h-60 overflow-y-auto border rounded">
            <ul className="divide-y">
              {addressResults.map((address, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelectAddress(address)}
                >
                  {`${address.logradouro}, ${address.bairro}, ${address.localidade}-${address.uf}, ${address.cep}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSearchModal;
