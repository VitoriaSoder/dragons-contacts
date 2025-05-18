import { z } from 'zod';

// Regex para validações comuns
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const cepRegex = /^\d{5}-\d{3}$/;

// Função auxiliar para validar CPF
const validateCpf = (cpf: string): boolean => {
  const cleanedCpf = cpf.replace(/[^\d]/g, '');

  if (cleanedCpf.length !== 11 || /^(\d)\1+$/.test(cleanedCpf)) return false;

  const calculateDigit = (base: number): number => {
    const sum = cleanedCpf
      .slice(0, base)
      .split('')
      .reduce((acc, num, i) => acc + parseInt(num) * (base + 1 - i), 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(9);
  const secondDigit = calculateDigit(10);

  return firstDigit === parseInt(cleanedCpf[9]) && secondDigit === parseInt(cleanedCpf[10]);
};

// Validação base para campos comuns
export const addressSchema = z.object({
  street: z.string().min(1, 'A rua é obrigatória'),
  number: z.string().min(1, 'O número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'O bairro é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  state: z.string().min(2, 'O estado é obrigatório').max(2, 'Use a sigla do estado (2 letras)'),
  postalCode: z
    .string()
    .min(1, 'O CEP é obrigatório')
    .regex(cepRegex, 'Formato de CEP inválido')
    .superRefine(async (cep, ctx) => {
      try {
        const cleanCep = cep.replace(/[^\d]/g, '');
        if (cleanCep.length !== 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CEP inválido',
          });
          return;
        }

        const formattedCep = `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`;
        const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
        const data = await response.json();

        if (data.erro) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CEP não encontrado',
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Erro ao validar CEP',
        });
      }
    }),
});

export const contactSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido').regex(emailRegex, 'Formato de email inválido'),
  phone: z
    .string()
    .min(1, 'O telefone é obrigatório')
    .regex(phoneRegex, 'Formato de telefone inválido: (99) 99999-9999'),
  cpf: z
    .string()
    .min(1, 'O CPF é obrigatório')
    .regex(cpfRegex, 'Formato de CPF inválido: 999.999.999-99')
    .refine(validateCpf, 'CPF inválido'),
  photo: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
});

export const contactWithAddressSchema = contactSchema.extend({
  street: z.string().min(1, 'A rua é obrigatória'),
  number: z.string().min(1, 'O número é obrigatório'),
  neighborhood: z.string().min(1, 'O bairro é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  state: z.string().min(2, 'O estado é obrigatório'),
  postalCode: z
    .string()
    .min(1, 'O CEP é obrigatório')
    .regex(cepRegex, 'Formato de CEP inválido')
    .superRefine(async (cep, ctx) => {
      try {
        const cleanCep = cep.replace(/[^\d]/g, '');
        if (cleanCep.length !== 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CEP inválido',
          });
          return;
        }

        const formattedCep = `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`;
        const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
        const data = await response.json();

        if (data.erro) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CEP não encontrado',
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Erro ao validar CEP',
        });
      }
    }),
});

export type ContactSchema = z.infer<typeof contactSchema>;
export type ContactWithAddressSchema = z.infer<typeof contactWithAddressSchema>;
