import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import ContactsList from '../../components/dashboard/Contact/ContactsList';
import MapView from '../../components/dashboard/Maps/MapView';
import { useContact } from '../../hooks/useContact';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import SortButton from '../../components/common/SortButton';
import { getCurrentUserName } from '../../utils/userUtils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userName = getCurrentUserName();

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
  const { contacts, setSelectedContact } = useContact();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Seleciona automaticamente o primeiro contato ao carregar ou atualizar a lista
  useEffect(() => {
    const sortedFilteredContacts = getSortedFilteredContacts();
    if (sortedFilteredContacts.length > 0) {
      setSelectedContact(sortedFilteredContacts[0]);
    }
  }, [contacts, searchTerm, orderBy]);

  const handleAddContact = () => {
    navigate('/add-contact');
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      (contact.cpf && contact.cpf.includes(searchTerm))
    );
  });

  const getSortedFilteredContacts = () => {
    return [...filteredContacts].sort((a, b) => {
      if (orderBy === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };

  const sortedContacts = getSortedFilteredContacts();

  return (
    <div className="flex flex-col h-screen">
      <Header userName={userName} />

      <main className="flex-1 overflow-hidden bg-gray-50 mt-16">
        <div className="mx-auto px-4 py-8" style={{ maxWidth: '1400px' }}>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Contatos</h1>

          <div className="flex items-center mb-6">
            <div className="flex-grow mr-4">
              <Input
                type="text"
                placeholder="Pesquisar por nome ou CPF..."
                fullWidth
                onChange={e => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>

            <SortButton
              direction={orderBy}
              className="mr-4"
              onClick={() => setOrderBy(orderBy === 'asc' ? 'desc' : 'asc')}
            />

            <Button onClick={handleAddContact} size="md" variant="primary">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Adicionar Contato
              </span>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 h-full">
            <div className="w-full md:w-2/5 lg:w-1/3 h-[500px] md:h-[calc(100vh-220px)]">
              <ContactsList className="h-full" contacts={sortedContacts} />
            </div>
            <div className="w-full md:w-3/5 lg:w-2/3 h-[500px] md:h-[calc(100vh-220px)]">
              <MapView className="h-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
