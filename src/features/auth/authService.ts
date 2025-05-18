interface User {
  id: string;
  email: string;
  password: string;
}

const getUsersFromLocalStorage = (): User[] => {
  const users = localStorage.getItem('users');
  if (!users) return [];
  return JSON.parse(users);
};

const login = (email: string, password: string): string | null => {
  const users = getUsersFromLocalStorage();

  const user = users.find(user => user.email === email);
  if (!user) {
    throw new Error('Email não encontrado');
  }

  if (user.password !== password) {
    throw new Error('Senha incorreta');
  }

  const token = generateToken(user);
  return token;
};

const generateToken = (user: User): string => {
  const expirationTime = Math.floor(Date.now() / 1000) + 604800;
  const token = `${user.id}_${expirationTime}`;
  return token;
};

const renewToken = (userId: string): string => {
  const expirationTime = Math.floor(Date.now() / 1000) + 604800;
  const token = `${userId}_${expirationTime}`;
  localStorage.setItem('auth-token', token);
  return token;
};

const logout = (): void => {
  localStorage.removeItem('auth-token');
};

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth-token');
  if (!token) return false;

  const [userId, expirationTime] = token.split('_');
  const expiration = parseInt(expirationTime);
  const currentTime = Math.floor(Date.now() / 1000);

  if (expiration - currentTime < 300 && expiration > currentTime) {
    renewToken(userId);
    return true;
  }

  return expiration > currentTime;
};

const authService = {
  login,
  logout,
  isAuthenticated,
  renewToken,
};

export default authService;
export type { User };
