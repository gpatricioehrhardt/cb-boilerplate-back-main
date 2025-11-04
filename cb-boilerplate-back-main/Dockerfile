FROM node:20-alpine

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN apk add --no-cache openssl3

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies (including Prisma)
RUN yarn install --frozen-lockfile

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client BEFORE building
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN yarn build

EXPOSE 4000

# Start the application
CMD ["node", "-r", "newrelic", "dist/src/main.js"]
