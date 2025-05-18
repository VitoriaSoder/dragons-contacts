import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import ContactForm from '../../components/contact/ContactForm';
import { useContact } from '../../hooks/useContact';
import { getCurrentUserName } from '../../utils/userUtils';

const EditContact: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { contacts } = useContact();
  const userName = getCurrentUserName();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const contactToEdit = contacts.find(contact => contact.id === id);
  const handleClose = () => navigate('/dashboard');

  const renderContent = () => {
    if (!contactToEdit) {
      return (
        <div className="pt-16 flex items-center justify-center flex-1">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4 text-center">Contato não encontrado</h1>
            <button
              onClick={handleClose}
              className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Voltar para Contatos
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-16 flex-1 overflow-auto">
        <div className="p-4 overflow-auto">
          <div className="max-w-screen-lg mx-auto">
            <ContactForm contact={contactToEdit} onClose={handleClose} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header userName={userName} />
      {renderContent()}
    </div>
  );
};

export default EditContact;
