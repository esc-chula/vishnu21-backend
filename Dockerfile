FROM node:20.2.0-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src src

RUN npm i -g pnpm && pnpm i && pnpm build && pnpm prune --prod

ENV BACKEND_PORT=3000

ENTRYPOINT [ "node", "dist/main.js" ]