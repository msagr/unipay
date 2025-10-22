ARG NODE_VERSION=22.19.0

FROM node:${NODE_VERSION}

LABEL name="unipay"
LABEL license="MIT"
LABEL description="Unipay Express Server"
LABEL version="1.0.0"

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# Create non-root user
RUN addgroup --system unipay \
    && useradd --system --gid unipay unipay

# Copy package files and install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code and set ownership
COPY --chown=unipay:unipay backend/ ${APP_HOME}

# Switch to non-root user
USER unipay

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
