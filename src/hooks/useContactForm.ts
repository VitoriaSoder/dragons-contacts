import { useState, useEffect } from 'react';
import { useContact } from './useContact';
import { getAddressByCEP, searchAddressByLocation } from '../services/viacep';
import type { Contact, ViaCepResponse } from '../types/contact';
import { geocodeAddress } from '../utils/geocode';
import { handleError } from '../utils/errorHandler';
import {
  formatCPF,
  formatPhone,
  validateCPF,
  validatePhone,
  validateEmail,
} from '../utils/formatters';

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
  addressSearch: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressSearch: () => Promise<void>;
  handleSelectAddress: (address: ViaCepResponse) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setAddressSearch: (value: string) => void;
  setShowAddressSearch: (value: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormState>>;
  setAddressResults: React.Dispatch<React.SetStateAction<ViaCepResponse[]>>;
}

export const useContactForm = (contact?: Contact, onClose?: () => void): ContactFormResult => {
  const { addContact, editContact, contacts } = useContact();
  const [isLoading, setIsLoading] = useState(false);
  const [addressResults, setAddressResults] = useState<ViaCepResponse[]>([]);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
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
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleAddressSearch = async () => {
    if (!addressSearch) {
      handleError('Digite um endereço para buscar');
      return;
    }

    setIsLoading(true);
    try {
      const cepMatch = addressSearch.match(/\d{5}-?\d{3}/);
      if (cepMatch) {
        const data = await getAddressByCEP(cepMatch[0]);
        if (data) {
          setFormData(prev => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            complement: data.complemento,
            postalCode: data.cep,
          }));
          setAddressResults([]);
          return;
        }
      }

      const searchTerms = addressSearch.split(',').map(term => term.trim());
      if (searchTerms.length < 2) {
        handleError('Digite o endereço no formato: rua, cidade, UF');
        return;
      }

      const [street, city, state] = searchTerms;
      if (!street || !city) {
        handleError('Digite pelo menos a rua e a cidade');
        return;
      }

      const results = await searchAddressByLocation(state || '', city, street);
      if (results.length === 0) {
        handleError('Nenhum endereço encontrado. Verifique se digitou corretamente.');
        return;
      }

      setAddressResults(results);
      setShowAddressSearch(true);
    } catch (error) {
      handleError(error, 'Erro ao buscar endereço');
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
    setAddressSearch('');
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!validateCPF(formData.cpf)) {
      handleError('CPF inválido');
      return;
    }

    if (!validatePhone(formData.phone)) {
      handleError('Telefone inválido');
      return;
    }

    if (!validateEmail(formData.email)) {
      handleError('Email inválido');
      return;
    }

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
    addressSearch,
    handleInputChange,
    handleAddressSearch,
    handleSelectAddress,
    handleSubmit,
    setAddressSearch,
    setShowAddressSearch,
    setFormData,
    setAddressResults,
  };
};
