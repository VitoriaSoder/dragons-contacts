export { default as contactService } from './contactService';
export {
  contactSchema,
  contactWithAddressSchema,
  addressSchema,
  validateCpf,
  validateCep,
} from './contactValidation';
export type { ContactSchema, ContactWithAddressSchema } from './contactValidation';
