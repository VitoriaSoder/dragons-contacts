import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema } from '../../schemas/auth/login';
import type { LoginSchema } from '../../schemas/auth/login';
import login from '../../services/auth/login';
import { handleError } from '../../utils/errorHandler';
import Button from '../common/Button';
import Input from '../common/Input';
import Typography from '../common/Typography';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const navigate = useNavigate();

  const onSubmit = (data: LoginSchema) => {
    try {
      const token = login(data.email, data.password);
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
          Insira suas credenciais para acessar sua conta
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Input
              type="email"
              id="email"
              placeholder="Insira seu email"
              fullWidth
              className={errors.email ? 'border-red-500' : ''}
              {...register('email')}
            />
            {errors.email && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.email.message}
              </Typography>
            )}
          </div>
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
            <div className="relative flex items-center">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Insira sua senha"
                fullWidth
                className={`${errors.password ? 'border-red-500' : ''} pr-10`}
                {...register('password')}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </div>
            </div>
            {errors.password && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.password.message}
              </Typography>
            )}
          </div>
        </div>

        <Button fullWidth variant="primary" size="lg">
          Entrar
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm" />
        </div>

        <Typography variant="body2" align="center" className="mt-4">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-semibold text-primary">
            Registre-se aqui
          </Link>
        </Typography>
      </form>
    </div>
  );
};

export default Login;
