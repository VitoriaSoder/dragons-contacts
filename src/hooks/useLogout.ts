import { useState } from 'react';
import { useAuth } from './useAuth';

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
