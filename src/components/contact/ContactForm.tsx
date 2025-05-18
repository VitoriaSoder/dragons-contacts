import React from 'react';
import { useContactForm } from '../../hooks/useContactForm';
import type { Contact } from '../../types/contact';
import Button from '../common/Button';
import Typography from '../common/Typography';
import Card from '../common/Card';
import FormField from '../common/FormField';
import InputGroup from '../common/InputGroup';
import AddressSearchModal from './AddressSearchModal';
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
  } = useContactForm(contact, onClose);

  const isEditMode = !!contact;

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <Card className="w-full bg-white p-6 rounded-lg shadow-sm">
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
              />
              <FormField
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </section>

          <section className="mb-6">
            <Typography variant="h3" className="text-sm font-medium mb-4">
              Informações de Endereço
            </Typography>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <InputGroup
                  label="CEP"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="00000-000"
                  required
                  helpText="Digite um CEP para preencher automaticamente as informações do endereço"
                >
                  <Button
                    type="button"
                    onClick={handleZipSearch}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </InputGroup>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Rua"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Número"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Complemento"
                name="complement"
                value={formData.complement}
                onChange={handleInputChange}
                placeholder="Apartamento, sala, etc."
                optional={!isEditMode}
              />
              <FormField
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                maxLength={2}
                placeholder="SP"
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

        {showAddressSearch && (
          <AddressSearchModal
            onClose={() => setShowAddressSearch(false)}
            isLoading={isLoading}
            stateSearch={stateSearch}
            citySearch={citySearch}
            streetSearch={streetSearch}
            setStateSearch={setStateSearch}
            setCitySearch={setCitySearch}
            setStreetSearch={setStreetSearch}
            onSearch={handleAddressSearch}
            addressResults={addressResults}
            onSelectAddress={handleSelectAddress}
          />
        )}
      </Card>
    </div>
  );
};

export default ContactForm;
