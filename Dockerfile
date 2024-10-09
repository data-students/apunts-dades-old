FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

# Clean install
RUN npm ci

COPY . .

RUN npm run build

FROM node:alpine AS runtime

WORKDIR /app

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]