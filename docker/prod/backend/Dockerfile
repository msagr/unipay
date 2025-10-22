# Stage 1: Build the application
ARG NODE_VERSION=22.19.0

FROM node:${NODE_VERSION} AS build

LABEL name="unipay"
LABEL license="MIT"
LABEL description="Unipay Express Server"
LABEL version="1.0.0"

# Set environment to production during the build
ENV NODE_ENV=production
ENV APP_HOME=/app

WORKDIR ${APP_HOME}

# Create a non-root user and set ownership
RUN addgroup --system unipay \
    && useradd --system --gid unipay unipay

# Copy only the necessary files for installing dependencies
COPY backend/package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Stage 2: Set up the production environment
FROM node:${NODE_VERSION} AS production

# Same labels for consistency
LABEL name="unipay"
LABEL license="MIT"
LABEL description="Unipay Express Server"
LABEL version="1.0.0"

# Set environment to production for the app
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_HOME=/app

WORKDIR ${APP_HOME}

# Copy from build stage to production (only the built files)
COPY --from=build ${APP_HOME} ${APP_HOME}

# Expose the port the app will run on
EXPOSE 3000

# Run the app as the non-root user
USER unipay

CMD ["npm", "run", "start"]
