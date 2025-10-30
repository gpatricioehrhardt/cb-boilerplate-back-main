FROM node:20-alpine

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN apk add --no-cache openssl3

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build
RUN npm install -g prisma
RUN prisma generate

EXPOSE 4000
CMD ["node", "-r", "newrelic", "dist/src/main.js"]
