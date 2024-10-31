FROM node:21.7.3-alpine AS builder
WORKDIR /usr/src/app
COPY ["package*.json", "ts*.json", "nest-cli.json", "./"]
RUN npm install --from-lock-file
COPY ["src", "./src"]
COPY .env ./
RUN npm run build

FROM node:21.7.3-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.env ./
COPY ["package.json", "./"]
EXPOSE 3030
CMD ["node", "dist/main"]
