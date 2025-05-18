import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Contact } from '../types/contact';

interface ContactContextType {
  selectedContact: Contact | null;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  contacts: Contact[];
  refreshContacts: () => void;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
}

const baserStorageKeys = 'dragon-contacts';

const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('auth-token');
  if (!token) return null;

  const [userId] = token.split('_');
  return userId;
};

const getUserStorageKey = (): string => {
  const userId = getUserIdFromToken();
  const storageKey = userId ? `${baserStorageKeys}_${userId}` : baserStorageKeys;
  return storageKey;
};

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [storageKey, setStorageKey] = useState<string>(getUserStorageKey());
  const [previousStorageKey, setPreviousStorageKey] = useState<string | null>(null);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const [, expirationTime] = token.split('_');
      const expiration = parseInt(expirationTime);
      const remainingTime = expiration - Math.floor(Date.now() / 1000);

      if (remainingTime < 300 && remainingTime > 0) {
        const [userId] = token.split('_');
        const newExpiration = Math.floor(Date.now() / 1000) + 3600;
        const newToken = `${userId}_${newExpiration}`;
        localStorage.setItem('auth-token', newToken);
      }
    };

    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateStorageKey = () => {
      const newKey = getUserStorageKey();
      if (newKey !== storageKey) {
        setPreviousStorageKey(storageKey);
        setStorageKey(newKey);
      }
    };

    updateStorageKey();
    window.addEventListener('storage', updateStorageKey);

    return () => {
      window.removeEventListener('storage', updateStorageKey);
    };
  }, [storageKey]);

  useEffect(() => {
    const storedContacts = localStorage.getItem(storageKey);

    if (storedContacts && storedContacts !== '[]') {
      setContacts(JSON.parse(storedContacts));
    } else {
      if (previousStorageKey) {
        const previousContacts = localStorage.getItem(previousStorageKey);

        if (previousContacts && previousContacts !== '[]') {
          setContacts(JSON.parse(previousContacts));
          localStorage.setItem(storageKey, previousContacts);
        } else {
          setContacts([]);
        }
      } else {
        setContacts([]);
      }
    }
  }, [storageKey, previousStorageKey]);

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(contacts));
    }
  }, [contacts, storageKey]);

  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newContact: Contact = {
      ...contactData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setContacts(prevContacts => {
      const updatedContacts = [...prevContacts, newContact];
      return updatedContacts;
    });
  };

  const editContact = (updatedContact: Contact) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === updatedContact.id
          ? { ...updatedContact, updatedAt: new Date().toISOString() }
          : contact
      )
    );
  };

  const deleteContact = (id: string) => {
    setContacts(prevContacts => {
      const updatedContacts = prevContacts.filter(contact => contact.id !== id);
      const currentStorageKey = getUserStorageKey();
      localStorage.setItem(currentStorageKey, JSON.stringify(updatedContacts));
      return updatedContacts;
    });
  };

  const refreshContacts = () => {
    const currentStorageKey = getUserStorageKey();
    const storedContacts = localStorage.getItem(currentStorageKey);
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    } else {
      setContacts([]);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        selectedContact,
        setSelectedContact,
        contacts,
        refreshContacts,
        addContact,
        editContact,
        deleteContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export default ContactContext;
