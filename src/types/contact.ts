export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsFilter {
  searchTerm?: string;
  orderBy?: 'asc' | 'desc';
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
