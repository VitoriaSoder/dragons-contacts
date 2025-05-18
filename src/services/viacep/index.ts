import type { ViaCepResponse } from '../../types/contact';
import { handleError } from '../../utils/errorHandler';
/**
 * Busca endereço pelo CEP utilizando a API ViaCEP
 * @param cep CEP para busca (apenas números)
 * @returns Dados do endereço ou null em caso de erro
 */
export const getAddressByCEP = async (cep: string): Promise<ViaCepResponse | null> => {
  try {
    const formattedCep = cep.replace(/\D/g, '');

    if (formattedCep.length !== 8) {
      throw new Error('CEP inválido');
    }

    const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);

    if (!response.ok) {
      throw new Error('Falha ao buscar CEP');
    }

    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return data as ViaCepResponse;
  } catch (error) {
    handleError(error, 'Erro ao buscar CEP');
    return null;
  }
};

/**
 * Busca endereços por UF, cidade e rua
 * @param uf Estado (UF)
 * @param city Cidade
 * @param street Rua, avenida, etc
 * @returns Array de endereços encontrados ou array vazio em caso de erro
 */
export const searchAddressByLocation = async (
  uf: string,
  city: string,
  street: string
): Promise<ViaCepResponse[]> => {
  try {
    if (!uf || !city || !street || street.length < 3) {
      throw new Error('Parâmetros de busca insuficientes');
    }

    const response = await fetch(`https://viacep.com.br/ws/${uf}/${city}/${street}/json/`);

    if (!response.ok) {
      throw new Error('Falha ao buscar endereços');
    }

    const data: ViaCepResponse[] = await response.json();
    return data;
  } catch (error) {
    handleError(error, 'Erro ao buscar endereços');
    return [];
  }
};
