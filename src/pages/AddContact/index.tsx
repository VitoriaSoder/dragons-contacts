import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import ContactForm from '../../components/contact/ContactForm';

const AddContact: React.FC = () => {
  const navigate = useNavigate();
  const userName = JSON.parse(localStorage.getItem('users') || '{}')[0].fullName;

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header userName={userName || ''} />

      <div className="pt-16 flex-1">
        <div className="p-4">
          <div className="max-w-screen-lg mx-auto">
            <ContactForm onClose={handleClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
