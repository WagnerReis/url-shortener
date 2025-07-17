FROM node:latest AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma
COPY . .

RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile \
  && npx prisma generate \
  && pnpm run build

FROM node:latest

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]