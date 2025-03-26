# Etapa de build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia pacotes e configurações do TypeScript
COPY package*.json ./
COPY tsconfig*.json ./

# Copia o restante do código
COPY prisma ./prisma/
COPY src ./src/

# Instala dependências e compila
RUN npm install
RUN npx prisma generate
RUN npm run build

# Etapa final
FROM node:22-alpine AS runner

WORKDIR /app

# Copia apenas o necessário
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# (Opcional) copie o .env se usar localmente também
# COPY --from=builder /app/.env ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
