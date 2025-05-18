import React from 'react';
import type { Contact } from '../../../types/contact';
import Icon from '../../common/Icon';
import IconButton from '../../common/IconButton';

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(contact);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(contact);
  };

  const firstLetter = contact.name.charAt(0).toUpperCase();

  return (
    <div
      className={`p-4 rounded-lg mb-3 cursor-pointer transition-all border ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50 border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="mr-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold">
            {firstLetter}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{contact.name}</h3>
          <div className="flex flex-col text-sm text-gray-500">
            <span>CPF: {contact.cpf}</span>
            <div className="flex items-center mt-1">
              <Icon type="phone" size="sm" className="mr-2 text-gray-400" />
              <span>{contact.phone}</span>
            </div>
            {(contact.city || contact.state) && (
              <div className="flex items-center mt-1">
                <Icon type="location" size="sm" className="mr-2 text-gray-400" />
                <span>{[contact.city, contact.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {(contact.latitude || contact.longitude) && (
              <div className="text-xs text-gray-400 mt-1">
                Lat: {contact.latitude?.toFixed(6)}, Long: {contact.longitude?.toFixed(6)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <IconButton
            icon={<Icon type="edit" />}
            onClick={handleEditClick}
            title="Editar contato"
            variant="default"
            className="text-gray-400 hover:text-indigo-600"
          />
          <IconButton
            icon={<Icon type="delete" />}
            onClick={handleDeleteClick}
            title="Excluir contato"
            variant="danger"
            className="text-gray-400 hover:text-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
