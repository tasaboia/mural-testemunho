# Etapa de build
FROM node:18-alpine as builder
WORKDIR /app

# Primeiro copiamos os arquivos de configuração
COPY package*.json ./
COPY tsconfig*.json ./

# Instalamos as dependências
RUN npm install

# Depois copiamos o resto dos arquivos
COPY . .

# Geramos o Prisma Client e fazemos o build
RUN npx prisma generate
RUN npm run build
RUN ls -la /app/dist
RUN cat /app/dist/main.js || echo "main.js não existe!"

# Stage de produção
FROM node:18-alpine
WORKDIR /app

# Copiamos apenas o necessário do stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"] 