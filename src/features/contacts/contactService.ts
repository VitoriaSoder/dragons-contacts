import type { Contact } from '../../types/contact';
import { handleError } from '../../utils/errorHandler';
import { geocodeAddress } from '../../utils/geocode';

const baserStorageKeys = 'dragon-contacts';

const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('auth-token');
  if (!token) return null;

  const [userId] = token.split('_');
  return userId;
};

const getUserStorageKey = (): string => {
  const userId = getUserIdFromToken();
  return userId ? `${baserStorageKeys}_${userId}` : baserStorageKeys;
};

const getAll = (): Contact[] => {
  try {
    const storageKey = getUserStorageKey();
    const contacts = localStorage.getItem(storageKey);
    return contacts ? JSON.parse(contacts) : [];
  } catch (error) {
    handleError(error, 'Erro ao carregar contatos');
    return [];
  }
};

const getById = (id: string): Contact | null => {
  try {
    const contacts = getAll();
    return contacts.find(contact => contact.id === id) || null;
  } catch (error) {
    handleError(error, 'Erro ao buscar contato');
    return null;
  }
};

const create = async (
  contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Contact> => {
  try {
    const contacts = getAll();

    const cpfExists = contacts.some(
      c => c.cpf.replace(/\D/g, '') === contactData.cpf.replace(/\D/g, '')
    );
    if (cpfExists) {
      throw new Error('Já existe um contato com este CPF cadastrado.');
    }

    let coordinates = null;
    if (contactData.street && contactData.city) {
      const addressString = `${contactData.street}, ${contactData.number || ''}, ${contactData.city}, ${contactData.state || ''}, Brazil`;
      coordinates = await geocodeAddress(addressString);
    }

    const now = new Date().toISOString();
    const newContact: Contact = {
      ...contactData,
      id: crypto.randomUUID(),
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
      createdAt: now,
      updatedAt: now,
    };

    const updatedContacts = [...contacts, newContact];
    const storageKey = getUserStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(updatedContacts));

    return newContact;
  } catch (error) {
    handleError(error, 'Erro ao criar contato');
    throw error;
  }
};

const update = async (id: string, contactData: Partial<Contact>): Promise<Contact> => {
  try {
    const contacts = getAll();
    const existingContactIndex = contacts.findIndex(c => c.id === id);

    if (existingContactIndex === -1) {
      throw new Error('Contato não encontrado');
    }

    if (contactData.cpf) {
      const cpfExists = contacts.some(
        c => c.id !== id && c.cpf.replace(/\D/g, '') === contactData.cpf!.replace(/\D/g, '')
      );
      if (cpfExists) {
        throw new Error('Já existe outro contato com este CPF cadastrado.');
      }
    }

    let coordinates = null;
    const existingContact = contacts[existingContactIndex];
    const addressChanged =
      (contactData.street !== undefined && contactData.street !== existingContact.street) ||
      (contactData.city !== undefined && contactData.city !== existingContact.city) ||
      (contactData.state !== undefined && contactData.state !== existingContact.state) ||
      (contactData.number !== undefined && contactData.number !== existingContact.number);

    if (addressChanged) {
      const street = contactData.street || existingContact.street;
      const number = contactData.number || existingContact.number;
      const city = contactData.city || existingContact.city;
      const state = contactData.state || existingContact.state;

      if (street && city) {
        const addressString = `${street}, ${number || ''}, ${city}, ${state || ''}, Brazil`;
        coordinates = await geocodeAddress(addressString);
      }
    }

    const updatedContact = {
      ...existingContact,
      ...contactData,
      updatedAt: new Date().toISOString(),
    };

    if (coordinates) {
      updatedContact.latitude = coordinates.latitude;
      updatedContact.longitude = coordinates.longitude;
    }

    contacts[existingContactIndex] = updatedContact;
    const storageKey = getUserStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(contacts));

    return updatedContact;
  } catch (error) {
    handleError(error, 'Erro ao atualizar contato');
    throw error;
  }
};

const remove = (id: string): void => {
  try {
    const contacts = getAll();
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    const storageKey = getUserStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(filteredContacts));
  } catch (error) {
    handleError(error, 'Erro ao remover contato');
    throw error;
  }
};

const contactService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default contactService;
