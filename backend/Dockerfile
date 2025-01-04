# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Install OpenSSL in build stage
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy prisma schema from the correct location
COPY src/db/prisma ./prisma/

# Install dependencies including TypeScript globally
RUN npm ci && npm install -g typescript

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app

# Install OpenSSL in production stage
RUN apt-get update -y && apt-get install -y openssl

# Copy package files and prisma schema
COPY package*.json ./
COPY src/db/prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production

# Generate Prisma Client in production
RUN npx prisma generate

# Copy built JavaScript files from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]