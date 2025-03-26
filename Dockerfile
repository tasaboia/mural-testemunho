FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN npm install

RUN npx prisma generate

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]
