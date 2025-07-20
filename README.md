# URL Shortener

Um encurtador de URLs, seguro e extensível, desenvolvido com NestJS, Prisma e PostgreSQL. Permite criar, listar, atualizar, deletar (deleção lógica) e redirecionar URLs encurtadas, com suporte a autenticação JWT.

## Tecnologias Utilizadas

- **Node.js**
- **NestJS** (framework principal)
- **Prisma ORM** (acesso a dados)
- **PostgreSQL** (banco de dados relacional)
- **Docker** e **Docker Compose** (ambiente isolado)
- **JWT** (autenticação)
- **Zod** (validação de dados)
- **Swagger** (documentação automática)

## Arquitetura

- **Modularização**: Separação clara entre módulos de autenticação, usuários e encurtador.
- **Use Cases**: Lógica de negócio isolada em casos de uso.
- **Repositórios**: Abstração de acesso a dados, facilitando troca de banco ou testes.
- **Pipes e Filters**: Validação e tratamento global de exceções.
- **Decorators e Guards**: Controle de autenticação e autorização.
- **Functional Error Handling**: Tratamento de erros de forma limpa e legível.

## Rodando com Docker

1. Copie o arquivo `.env.docker.example` para `.env` e ajuste as variáveis se necessário.
2. Execute:

```bash
docker compose up --build
```

ou

```bash
docker-compose up --build
```

dependendo da sua versão do Docker.

O serviço estará disponível em [http://localhost:3000](http://localhost:3000)

Acesse a documentação Swagger em: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Como Rodar Localmente

### 1. Pré-requisitos

- Node.js 20+
- pnpm (ou npm/yarn)
- PostgreSQL

### 2. Instalação

```bash
pnpm install
```

ou

```bash
npm install
```

### 3. Configuração do Banco de Dados

1. Copie o arquivo `.env.local.example` para `.env` e ajuste as variáveis.
2. Execute:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/url_shortener
JWT_SECRET=sua_chave_jwt
```

### 4. Rodando as Migrações

```bash
npx prisma migrate dev
```

### 5. Iniciando o Projeto

```bash
pnpm run start:dev
```

Acesse a documentação Swagger em: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Autenticação

- Endpoints protegidos usam JWT Bearer Token.
- Crie um usuário e faça login para obter o token.
- Endpoints públicos permitem encurtar URLs sem autenticação, mas URLs criadas sem usuário não ficam associadas a um perfil.

## Funcionalidades

- Criar URL encurtada (com ou sem autenticação)
- Listar URLs do usuário autenticado, com paginação e e ordenação
- Atualizar e deletar URLs (soft delete)
- Redirecionamento por shortCode
- Contador de cliques
- Validação robusta de dados
- Documentação Swagger

## Funcionalidades que podem ser adicionadas futuramente

- Expiração de URLs
- Personalização do shortCode
- Estatísticas detalhadas de acesso (geolocalização, navegador, etc)
- Painel administrativo
- Limite de uso por usuário
- Integração com autenticação OAuth (Google, GitHub, etc)
