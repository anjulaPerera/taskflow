# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first
# Docker caches each layer — copying package.json before src
# means npm install only re-runs when dependencies change,
# not on every code change
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source and compile TypeScript
COPY . .
RUN npm run build

# Stage 2 — Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what's needed to run
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001
USER nodeuser

EXPOSE 5000

CMD ["node", "dist/index.js"]