import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import FormField from '../../components/common/FormField';
import Typography from '../../components/common/Typography';
import { showToast } from '../../utils/toast';
import { handleError } from '../../utils/errorHandler';
import { saveUsersToLocalStorage } from '../../services/auth/register';
import { registerSchema } from '../../schemas/auth/register';
import BackButton from '../../components/common/BackButton';
import { ZodError } from 'zod';
import Card from '../../components/common/Card';
import { getCurrentUser } from '../../utils/userUtils';

interface User {
  id: string;
  email: string;
  password: string;
  fullName?: string;
}

const getUsersFromLocalStorage = (): User[] => {
  const users = localStorage.getItem('users');
  if (!users) return [];
  return JSON.parse(users);
};

const AccountSettings: React.FC = () => {
  const users = getUsersFromLocalStorage();
  const currentUser = getCurrentUser();

  const [name, setName] = useState<string>(currentUser?.fullName || '');
  const [email] = useState<string>(currentUser?.email || '');

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSaveChanges = () => {
    try {
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex === -1) {
        showToast.error('Usuário não encontrado');
        return;
      }
      if (name.trim() === '') {
        showToast.error('Nome não pode ser vazio');
        return;
      }
      users[userIndex].fullName = name;
      if (newPassword || confirmPassword) {
        if (!newPassword || !confirmPassword) {
          showToast.error('Preencha os campos de senha');
          return;
        }
        if (newPassword !== confirmPassword) {
          showToast.error('As senhas não coincidem');
          return;
        }

        try {
          registerSchema.parse({
            fullName: name,
            email: email,
            password: newPassword,
            confirmPassword: confirmPassword,
          });
        } catch (error) {
          if (error instanceof ZodError && error.errors?.[0]?.message) {
            showToast.error(error.errors[0].message);
            return;
          }
          showToast.error('Senha inválida');
          return;
        }

        users[userIndex].password = newPassword;
      }
      saveUsersToLocalStorage(users.map(u => ({ ...u, fullName: u.fullName || '' })));
      setNewPassword('');
      setConfirmPassword('');
      showToast.success('Alterações salvas com sucesso!');
    } catch (error) {
      handleError(error, 'Erro ao salvar alterações');
    }
  };

  const openDeleteDialog = () => {
    setIsDialogOpen(true);
    setPassword('');
  };

  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setPassword('');
    setIsDeleting(false);
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    try {
      const user = users.find(u => u.email === email);
      if (!user) {
        showToast.error('Usuário não encontrado');
        setIsDeleting(false);
        return;
      }
      if (user.password !== password) {
        showToast.error('Senha incorreta');
        setIsDeleting(false);
        return;
      }

      const updatedUsers = users.filter(u => u.email !== email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem('auth-token');
      showToast.success('Conta excluída com sucesso!');
      setIsDialogOpen(false);
      navigate('/login');
    } catch (error) {
      handleError(error, 'Erro ao excluir a conta');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 gap-8">
      <Header userName={name} />

      <main className="flex-1 overflow-hidden bg-gray-50 mt-20">
        <div className="mx-auto max-w-[1024px] p-6">
          <div className="mb-6">
            <BackButton />
          </div>

          <Card className="w-full bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <Typography variant="h3" className="text-lg font-medium mb-4">
                Configurações da Conta
              </Typography>
              <Typography variant="body1" color="gray-600" className="mb-6">
                Atualize suas informações de conta ou delete sua conta
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <FormField
                    label="Nome"
                    name="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    disabled
                    inputClassName="bg-gray-100 cursor-not-allowed"
                    helpText="Email não pode ser alterado"
                  />
                </div>
              </div>

              <Typography variant="h3" className="text-sm font-medium my-4">
                Alterar Senha
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <FormField
                    label="Nova senha"
                    name="new-password"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="mb-4">
                  <FormField
                    label="Confirmar nova senha"
                    name="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                <Button variant="danger" onClick={openDeleteDialog}>
                  Excluir Conta
                </Button>
                <Button onClick={handleSaveChanges} variant="primary">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center p-4 border-b">
              <div className="mr-3 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Typography variant="subtitle1" component="h3" className="text-lg font-medium">
                Excluir Conta
              </Typography>
            </div>
            <div className="p-6 bg-red-50 border-red-200">
              <Typography variant="body1" className="text-gray-700 mb-4">
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita. Todos os
                seus dados serão removidos permanentemente.
              </Typography>
              <FormField
                label="Digite sua senha para confirmar:"
                name="delete-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                disabled={isDeleting}
              />
            </div>
            <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse gap-2">
              <Button
                onClick={handleDeleteAccount}
                variant="danger"
                disabled={isDeleting || !password}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </Button>
              <Button onClick={closeDeleteDialog} variant="secondary" disabled={isDeleting}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
