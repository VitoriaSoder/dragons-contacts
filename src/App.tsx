import Router from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import authService from './features/auth/authService';

function App() {
  useEffect(() => {
    const checkAuth = () => {
      authService.isAuthenticated();
    };

    checkAuth();

    const interval = setInterval(checkAuth, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router />
    </BrowserRouter>
  );
}

export default App;
