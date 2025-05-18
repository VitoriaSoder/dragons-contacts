import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactCard from './ContactCard';
import { useContact } from '../../../hooks/useContact';
import Dialog from '../../common/Dialog';
import type { Contact } from '../../../types/contact';
import Typography from '../../common/Typography';
import Button from '../../common/Button';

interface ContactsListProps {
  className?: string;
  contacts: Contact[];
}

const ContactsList: React.FC<ContactsListProps> = ({ className = '', contacts }) => {
  const { selectedContact, setSelectedContact, deleteContact } = useContact();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const handleContactClick = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setSelectedContact(contact);
    }
  };

  const handleEditContact = (contact: Contact) => {
    navigate(`/edit-contact/${contact.id}`);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact.id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete);
      setDialogOpen(false);
      setContactToDelete(null);

      if (selectedContact?.id === contactToDelete) {
        setSelectedContact(null);
      }
    }
  };

  return (
    <div className={`border bg-white p-6 rounded-lg flex flex-col ${className}`}>
      <div className="overflow-y-auto max-h-[calc(100vh-230px)] flex-1">
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onClick={() => handleContactClick(contact.id)}
              onEdit={handleEditContact}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center p-4 bg-white rounded-lg">
            <Typography className="text-gray-500 text-lg">Nenhum contato encontrado</Typography>
            <Button variant="primary" size="sm" onClick={() => navigate('/add-contact')}>
              Adicionar Contato
            </Button>
          </div>
        )}
      </div>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Contato"
        message="Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default ContactsList;
