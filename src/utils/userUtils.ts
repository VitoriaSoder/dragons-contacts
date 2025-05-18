interface User {
  id: string;
  email: string;
  password: string;
  fullName?: string;
}

export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('auth-token');
  if (!token) return null;

  const [userId] = token.split('_');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  return users.find((user: User) => user.id === userId) || null;
};

export const getCurrentUserName = (): string => {
  const currentUser = getCurrentUser();
  return currentUser?.fullName || 'Usuário';
};
