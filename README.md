# Dragon Contacts

Este é um projeto React + TypeScript + Vite criado para gerenciar contatos e seus respectivos endereços.

A ideia do projeto é oferecer uma forma simples de salvar contatos e seus respectivos endereços, permitindo também visualizar os endereços no Google Maps.

## Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- React Icons
- React Toastify
- Tailwind CSS
- Zod para validação
- ViaCEP para busca de endereços

## Como rodar o projeto

1. Certifique-se de ter o Node.js instalado.
2. Clone o repositório.
3. Instale as dependências do projeto:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env.local` na raiz do projeto com a seguinte variável de ambiente:

   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
   ```

   Substitua `YOUR_GOOGLE_MAPS_API_KEY` pela sua chave da API do Google Maps.

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O aplicativo estará disponível em [http://localhost:5173](http://localhost:5173).

## Scripts disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Executa a verificação de linting.
- `npm run lint:fix`: Corrige problemas de linting automaticamente.
- `npm run format`: Formata o código com Prettier.
- `npm run preview`: Pré-visualiza a versão de produção localmente.

## Funcionalidades

- Cadastro e gerenciamento de contatos
- Busca de endereços via CEP (integração com ViaCEP)
- Visualização de endereços no Google Maps
- Autenticação de usuários

## Requisitos

- Chave da API do Google Maps para visualização dos mapas.
- Conexão com internet para busca de endereços via ViaCEP.

## Estrutura do Projeto

O projeto segue uma estrutura organizada por recursos:

- `/src/components`: Componentes reutilizáveis da UI
- `/src/pages`: Páginas da aplicação
- `/src/services`: Serviços para comunicação com APIs externas
- `/src/hooks`: Hooks personalizados
- `/src/context`: Contextos React para gerenciamento de estado
- `/src/utils`: Funções utilitárias
- `/src/types`: Definições de tipos TypeScript
- `/src/schemas`: Esquemas de validação
- `/src/routes`: Configuração de rotas

```

```
