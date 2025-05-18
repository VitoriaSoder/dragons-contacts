import { useAuth } from './useAuth';

export const useCurrentUser = () => {
  const { user, isLoggedIn } = useAuth();

  return {
    user,
    isLoggedIn,
  };
};
