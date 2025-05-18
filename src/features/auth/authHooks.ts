import { useState } from 'react';
import { useAuth } from './authContext';
import { handleError } from '../../utils/errorHandler';

export const useLoginForm = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch {
      handleError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};

export const useCurrentUser = () => {
  const { user, isLoggedIn } = useAuth();

  return {
    user,
    isLoggedIn,
  };
};

export const useLogout = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    logout();
    setIsLoading(false);
  };

  return {
    logout: handleLogout,
    isLoading,
  };
};
