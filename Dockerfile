FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# Clean install
RUN npm ci

COPY . .

ARG DATABASE_URL=${DATABASE_URL}

RUN npm run build

FROM node:alpine AS runtime

WORKDIR /app

COPY --from=build /app/.next ./.next

ENV NODE_ENV production

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]