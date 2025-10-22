# Stage 1: Build the application
ARG NODE_VERSION=22.19.0

FROM node:${NODE_VERSION} AS build

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# Install build tools for compiling dependencies
RUN apt-get update && apt-get install -y python3 make g++ \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy only package.json and lock first for caching npm install
COPY frontend/package*.json ./

# Install dependencies (including build dependencies)
RUN npm install

# Copy the application code and build the frontend
COPY frontend/ ${APP_HOME}

# Run the build process (e.g., build the app with npm run build)
RUN npm run build

# Stage 2: Production environment (lighter and without build tools)
FROM node:${NODE_VERSION} AS production

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# Set NODE_ENV to production to avoid installing dev dependencies
ENV NODE_ENV=production

# Copy only the built files from the build stage
COPY --from=build ${APP_HOME}/dist ${APP_HOME}/dist

# Copy the package.json (no need for node_modules in prod)
COPY frontend/package*.json ./

# Install only production dependencies (omit dev dependencies)
RUN npm install --production

# Expose the port that the app will run on (e.g., 3000 for React apps)
EXPOSE 3000

# Default command to start the app (e.g., running with a production server)
CMD ["npm", "run", "start"]
