FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar o restante dos arquivos
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Construir a aplicação
RUN npm run build

# Imagem de produção
FROM node:18-alpine

WORKDIR /app

# Copiar apenas o necessário para produção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expor a porta da aplicação
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"] 