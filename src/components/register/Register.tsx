import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerSchema } from '../../schemas/auth/register';
import type { RegisterSchema } from '../../schemas/auth/register';
import register from '../../services/auth/register';
import { handleError } from '../../utils/errorHandler';
import Button from '../common/Button';
import Input from '../common/Input';
import Typography from '../common/Typography';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const navigate = useNavigate();

  const onSubmit = (data: RegisterSchema) => {
    try {
      const token = register(data.fullName, data.email, data.password);
      if (token) {
        localStorage.setItem('auth-token', token);
        navigate('/dashboard');
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="flex flex-col items-center mb-8">
        <Typography variant="h3" className="text-gray-600 mt-4">
          Seja bem-vindo
        </Typography>
        <Typography variant="body2" className="text-gray-600 mt-4">
          Insira suas informações para criar uma conta
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Typography
            variant="body1"
            component="label"
            htmlFor="fullName"
            className="text-sm font-medium"
          >
            Nome Completo <span className="text-red-500">*</span>
          </Typography>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <Input
              type="text"
              id="fullName"
              placeholder="João Silva"
              fullWidth
              className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
              {...registerForm('fullName')}
            />
          </div>
          {errors.fullName && (
            <Typography variant="caption" className="text-red-500 mt-1 block">
              {errors.fullName.message}
            </Typography>
          )}
        </div>

        <div className="space-y-1">
          <Typography
            variant="body1"
            component="label"
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email <span className="text-red-500">*</span>
          </Typography>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <Input
              type="email"
              id="email"
              placeholder="joao@exemplo.com"
              fullWidth
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              {...registerForm('email')}
            />
          </div>
          {errors.email && (
            <Typography variant="caption" className="text-red-500 mt-1 block">
              {errors.email.message}
            </Typography>
          )}
        </div>

        <div className="space-y-1">
          <Typography
            variant="body1"
            component="label"
            htmlFor="password"
            className="text-sm font-medium"
          >
            Senha <span className="text-red-500">*</span>
          </Typography>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              fullWidth
              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              {...registerForm('password')}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400" />
              ) : (
                <FiEye className="text-gray-400" />
              )}
            </div>
          </div>
          {errors.password && (
            <Typography variant="caption" className="text-red-500 mt-1 block">
              {errors.password.message}
            </Typography>
          )}
        </div>

        <div className="space-y-1">
          <Typography
            variant="body1"
            component="label"
            htmlFor="confirmPassword"
            className="text-sm font-medium"
          >
            Confirmar Senha <span className="text-red-500">*</span>
          </Typography>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="••••••••"
              fullWidth
              className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              {...registerForm('confirmPassword')}
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="text-gray-400" />
              ) : (
                <FiEye className="text-gray-400" />
              )}
            </div>
          </div>
          {errors.confirmPassword && (
            <Typography variant="caption" className="text-red-500 mt-1 block">
              {errors.confirmPassword.message}
            </Typography>
          )}
        </div>

        <Button fullWidth variant="primary" size="lg">
          Criar Conta
        </Button>

        <Typography variant="body2" align="center" className="mt-4">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </Typography>
      </form>
    </div>
  );
};

export default Register;
