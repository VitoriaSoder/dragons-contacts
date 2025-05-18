import { useState, useEffect } from 'react';
import { useContact } from './useContact';
import { getAddressByCEP, searchAddressByLocation } from '../services/viacep';
import type { Contact, ViaCepResponse } from '../types/contact';
import { geocodeAddress } from '../utils/geocode';
import { handleError } from '../utils/errorHandler';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
}

interface ContactFormResult {
  formData: ContactFormState;
  isLoading: boolean;
  addressResults: ViaCepResponse[];
  showAddressSearch: boolean;
  stateSearch: string;
  citySearch: string;
  streetSearch: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleZipSearch: () => Promise<void>;
  handleAddressSearch: (e: React.FormEvent) => Promise<void>;
  handleSelectAddress: (address: ViaCepResponse) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setStateSearch: (value: string) => void;
  setCitySearch: (value: string) => void;
  setStreetSearch: (value: string) => void;
  setShowAddressSearch: (value: boolean) => void;
}

export const useContactForm = (contact?: Contact, onClose?: () => void): ContactFormResult => {
  const { addContact, editContact, contacts } = useContact();
  const [isLoading, setIsLoading] = useState(false);
  const [addressResults, setAddressResults] = useState<ViaCepResponse[]>([]);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const isEditMode = !!contact;

  const initialFormState: ContactFormState = {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: '',
  };

  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [streetSearch, setStreetSearch] = useState('');

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        cpf: contact.cpf || '',
        street: contact.street || '',
        number: contact.number || '',
        complement: contact.complement || '',
        neighborhood: contact.neighborhood || '',
        city: contact.city || '',
        state: contact.state || '',
        postalCode: contact.postalCode || '',
      });
    }
  }, [contact]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleZipSearch = async () => {
    if (!formData.postalCode) return;

    setIsLoading(true);
    try {
      const data = await getAddressByCEP(formData.postalCode);
      if (data) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          complement: data.complemento,
        }));
      }
    } catch (error) {
      handleError(error, 'Erro ao buscar CEP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateSearch || !citySearch || !streetSearch) return;

    setIsLoading(true);
    try {
      const results = await searchAddressByLocation(stateSearch, citySearch, streetSearch);
      setAddressResults(results);
    } catch (error) {
      handleError(error, 'Erro ao buscar endereços');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address: ViaCepResponse) => {
    setFormData(prev => ({
      ...prev,
      street: address.logradouro,
      neighborhood: address.bairro,
      city: address.localidade,
      state: address.uf,
      postalCode: address.cep,
    }));
    setAddressResults([]);
    setShowAddressSearch(false);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const cpfExists = isEditMode
      ? contacts.some(
          c => c.id !== contact!.id && c.cpf.replace(/\D/g, '') === formData.cpf.replace(/\D/g, '')
        )
      : contacts.some(c => c.cpf.replace(/\D/g, '') === formData.cpf.replace(/\D/g, ''));

    if (cpfExists) {
      handleError(
        isEditMode
          ? 'Já existe outro contato com este CPF cadastrado.'
          : 'Já existe um contato com este CPF cadastrado.'
      );
      return;
    }

    const saveContact = async () => {
      setIsLoading(true);
      try {
        const addressString = `${formData.street}, ${formData.number}, ${formData.city}, ${formData.state}, Brazil`;
        const coordinates = await geocodeAddress(addressString);

        const baseContactData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          address: `${formData.street}, ${formData.number}${
            formData.complement ? ` - ${formData.complement}` : ''
          }, ${formData.neighborhood}, ${formData.city}-${formData.state}, ${formData.postalCode}`,
          latitude: coordinates?.latitude,
          longitude: coordinates?.longitude,
        };

        if (isEditMode && contact) {
          editContact({
            ...baseContactData,
            id: contact.id,
            createdAt: contact.createdAt,
            updatedAt: new Date().toISOString(),
          });
        } else {
          addContact(baseContactData);
        }

        onClose?.();
      } catch (error) {
        handleError(error, `Erro ao ${isEditMode ? 'atualizar' : 'salvar'} contato`);
      } finally {
        setIsLoading(false);
      }
    };

    saveContact();
  };

  return {
    formData,
    isLoading,
    addressResults,
    showAddressSearch,
    stateSearch,
    citySearch,
    streetSearch,
    handleInputChange,
    handleZipSearch,
    handleAddressSearch,
    handleSelectAddress,
    handleSubmit,
    setStateSearch,
    setCitySearch,
    setStreetSearch,
    setShowAddressSearch,
  };
};
