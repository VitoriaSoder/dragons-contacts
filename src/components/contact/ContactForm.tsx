import React, { useEffect, useRef } from 'react';
import { useContactForm } from '../../hooks/useContactForm';
import type { Contact, ViaCepResponse } from '../../types/contact';
import Button from '../common/Button';
import Typography from '../common/Typography';
import Card from '../common/Card';
import FormField from '../common/FormField';
import InputGroup from '../common/InputGroup';
import BackButton from '../common/BackButton';

interface ContactFormProps {
  contact?: Contact;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onClose }) => {
  const {
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
  } = useContactForm(contact, onClose);

  const isEditMode = !!contact;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddressSearch(false);
      }
    }
    if (showAddressSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressSearch]);

  function getUniqueAddresses(addresses: ViaCepResponse[]): ViaCepResponse[] {
    const seen = new Set();
    return addresses.filter((addr: ViaCepResponse) => {
      const key = `${addr.cep}-${addr.logradouro}-${addr.bairro}-${addr.localidade}-${addr.uf}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <section className="mb-6">
            <Typography variant="h3" className="text-sm font-medium mb-4">
              Informações Pessoais
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ex: João da Silva"
              />
              <FormField
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                required
                placeholder="000.000.000-00"
              />
              <FormField
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="(00) 00000-0000"
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Ex: joao@email.com"
              />
            </div>
          </section>

          <section className="mb-6">
            <Typography variant="h3" className="text-sm font-medium mb-4">
              Informações de Endereço
            </Typography>
            <div className="flex flex-col">
              <div className="flex-1">
                <InputGroup
                  label="Buscar Endereço"
                  name="addressSearch"
                  value={addressSearch}
                  onChange={e => setAddressSearch(e.target.value)}
                  placeholder="Ex: Rua Barão do Arroio, São Paulo, SP"
                  helpText={
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      <p>Exemplos de como buscar:</p>
                      <ul className="list-disc pl-4">
                        <li>Por CEP: 01311-000</li>
                        <li>Por endereço: Rua Barão do Arroio, São Paulo, SP</li>
                        <li>Por endereço: Avenida Paulista, São Paulo, SP</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                    <Button
                      type="button"
                      onClick={handleAddressSearch}
                      variant="primary"
                      className="px-3 py-1 text-sm w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Buscando...' : 'Buscar'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setAddressSearch('');
                        setFormData(prev => ({
                          ...prev,
                          street: '',
                          number: '',
                          complement: '',
                          neighborhood: '',
                          city: '',
                          state: '',
                          postalCode: '',
                        }));
                        setAddressResults([]);
                        setShowAddressSearch(false);
                      }}
                      variant="secondary"
                      className="px-3 py-1 text-sm w-full sm:w-auto"
                    >
                      Limpar
                    </Button>
                  </div>
                </InputGroup>
              </div>
            </div>

            {showAddressSearch && addressResults.length > 0 && (
              <div ref={dropdownRef} className="mt-2 border rounded bg-white shadow-lg">
                <div className="p-2 bg-gray-50 border-b">
                  <Typography variant="body2" className="text-gray-600">
                    Selecione um endereço:
                  </Typography>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <ul className="divide-y">
                    {getUniqueAddresses(addressResults).map(
                      (address: ViaCepResponse, index: number) => (
                        <li
                          key={index}
                          className="p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => handleSelectAddress(address)}
                        >
                          <div className="font-medium text-gray-800">{address.logradouro}</div>
                          <div className="text-sm text-gray-600">
                            {address.bairro}, {address.localidade}-{address.uf}
                          </div>
                          <div className="text-xs text-gray-500">CEP: {address.cep}</div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Rua"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                placeholder="Ex: Rua Barão do Arroio"
              />
              <FormField
                label="Número"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
                placeholder="Ex: 123"
              />
              <FormField
                label="Complemento"
                name="complement"
                value={formData.complement}
                onChange={handleInputChange}
                placeholder="Ex: Sala 45, Apto 302"
                optional={!isEditMode}
              />
              <FormField
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                required
                placeholder="Ex: Jardins"
              />
              <FormField
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="Ex: São Paulo"
              />
              <FormField
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                maxLength={2}
                placeholder="Ex: SP"
                required
              />
            </div>
          </section>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="px-4 py-1.5 text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-1.5 text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : isEditMode ? 'Salvar Alterações' : 'Adicionar Contato'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ContactForm;
