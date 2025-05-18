import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

const getUsersFromLocalStorage = (): User[] => {
  const users = localStorage.getItem('users');
  if (!users) return [];
  return JSON.parse(users);
};

const saveUsersToLocalStorage = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

const register = (fullName: string, email: string, password: string): string | null => {
  const users = getUsersFromLocalStorage();

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error('Este email já está em uso');
  }

  const newUser: User = {
    id: uuidv4(),
    fullName,
    email,
    password,
  };

  users.push(newUser);
  saveUsersToLocalStorage(users);

  const token = generateToken(newUser);
  return token;
};

const generateToken = (user: User): string => {
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const token = `${user.id}_${expirationTime}`;
  return token;
};

export default register;
export { saveUsersToLocalStorage };
