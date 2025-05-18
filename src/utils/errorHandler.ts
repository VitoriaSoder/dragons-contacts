import { showToast } from './toast';

/**
 * Função para tratamento centralizado de erros
 * Esta função pode ser usada em blocos catch para tratar erros de forma consistente
 *
 * Exemplo de uso:
 * ```
 * try {
 *   // código que pode gerar erro
 * } catch (error) {
 *   handleError(error, 'Erro ao processar operação');
 * }
 * ```
 *
 * @param error O erro capturado
 * @param fallbackMessage Mensagem opcional a ser exibida caso o erro não tenha uma mensagem
 */
export const handleError = (error: unknown, fallbackMessage?: string): void => {
  if (error instanceof Error) {
    showToast.error(error.message);
  } else if (typeof error === 'string') {
    showToast.error(error);
  } else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    showToast.error(error.message);
  } else {
    showToast.error(fallbackMessage || 'Ocorreu um erro inesperado');
  }
};

/**
 * Wrapper para ações assíncronas que podem gerar erros
 * Auxilia na implementação do try/catch de forma mais limpa
 *
 * Exemplo de uso:
 * ```
 * const result = await asyncHandler(
 *   async () => {
 *     const response = await api.getData();
 *     return response.data;
 *   },
 *   'Erro ao buscar dados'
 * );
 *
 * if (result) {
 *   // continuar com o processamento
 * }
 * ```
 *
 * @param fn Função assíncrona a ser executada
 * @param errorMessage Mensagem opcional de erro caso ocorra uma falha
 */
export const asyncHandler = async <T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, errorMessage);
    return undefined;
  }
};

/**
 * HOC (Higher-Order Component) para envolver funções que podem lançar exceções
 * Use esta função para "proteger" funções síncronas e mostrar erros via toast
 *
 * Exemplo de uso:
 * ```
 * const processData = withErrorHandling(
 *   (data) => {
 *     // código que pode gerar erro
 *     return transformedData;
 *   },
 *   'Erro ao processar dados'
 * );
 *
 * const result = processData(myData);
 * ```
 *
 * @param fn Função a ser executada
 * @param errorMessage Mensagem opcional de erro caso ocorra uma falha
 */
export const withErrorHandling = <T, Args extends unknown[]>(
  fn: (...args: Args) => T,
  errorMessage?: string
) => {
  return (...args: Args): T | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, errorMessage);
      return undefined;
    }
  };
};
