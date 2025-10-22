# ---------------------------
# Stage 1: Build Next.js
# ---------------------------
ARG NODE_VERSION=22.19.0
FROM node:${NODE_VERSION} AS builder

# App working directory
ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# Set production env variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_BACKEND_URI=http://localhost:8080

# Copy package.json and package-lock.json first (for caching deps)
COPY frontend/package*.json ./

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ \
    && npm ci \
    && npm install lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy app source code
COPY frontend/ ${APP_HOME}

# Build Next.js
RUN npm run build

# ---------------------------
# Stage 2: Production image
# ---------------------------
FROM node:${NODE_VERSION}

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# Set production env variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_BACKEND_URI=http://localhost:8080

# Copy build artifacts + node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start Next.js in production
CMD ["npx", "next", "start"]
