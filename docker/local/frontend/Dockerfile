# Use Node 22
ARG NODE_VERSION=22.19.0
FROM node:${NODE_VERSION}

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# Set environment variable to detect if app is inside Docker
ENV NODE_ENV=staging
ENV NEXT_PUBLIC_BACKEND_URI=http://localhost:8080

# Copy only package.json and lock first for caching
COPY frontend/package*.json ./

# Install build tools (for native compilation fallback)
# and install LightningCSS + Oxide Linux binaries manually
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf node_modules package-lock.json \
    && npm install \
    && npm install lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY frontend/ ${APP_HOME}

# Ensure node_modules is internal to container (prevents Windows overwrite)
VOLUME ["/app/node_modules"]

# Default command
CMD ["npm", "run", "dev"]
