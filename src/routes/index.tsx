import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/login';
import Register from '../pages/Auth/register';
import Dashboard from '../pages/Dashboard';
import AddContact from '../pages/AddContact';
import EditContact from '../pages/EditContact';
import AccountSettings from '../pages/AccountSettings';
import { ContactProvider } from '../context/ContactContext';

const Router = () => {
  const isAuthenticated = !!localStorage.getItem('auth-token');

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <ContactProvider>{children}</ContactProvider>;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-contact"
        element={
          <ProtectedRoute>
            <AddContact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-contact/:id"
        element={
          <ProtectedRoute>
            <EditContact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account-settings"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
