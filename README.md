# Mural de Testemunhos - Backend

Backend para o projeto "Mural de Testemunhos da Comunidade", uma aplicação web onde membros da igreja compartilham testemunhos de fé de forma pública ou anônima.

## Tecnologias

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger API Documentation

## Requisitos

- Node.js (v16+)
- PostgreSQL

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações do banco de dados
npm run prisma:migrate

# Iniciar o servidor em modo de desenvolvimento
npm run start:dev

