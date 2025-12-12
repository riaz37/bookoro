FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install dependencies (frozen lockfile for consistency)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend ./apps/backend

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build the application
RUN pnpm build

# --- Production Stage ---
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package headers
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built assets and Prisma client from base stage
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/node_modules ./apps/backend/node_modules

# Set working directory to backend app
WORKDIR /app/apps/backend

# Expose port
EXPOSE 4000

# Start application
CMD ["node", "dist/main"]
