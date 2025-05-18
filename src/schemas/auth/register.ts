import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Nome completo é obrigatório').min(3, 'Nome muito curto'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .refine(
        password => /[A-Z]/.test(password),
        'Senha deve conter pelo menos uma letra maiúscula'
      )
      .refine(password => /[0-9]/.test(password), 'Senha deve conter pelo menos um número')
      .refine(
        password => /[^A-Za-z0-9]/.test(password),
        'Senha deve conter pelo menos um caractere especial'
      ),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
