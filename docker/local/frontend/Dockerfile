ARG NODE_VERSION=22.19.0

FROM node:${NODE_VERSION}

ARG APP_HOME=/app 
WORKDIR ${APP_HOME}

COPY frontend/package*.json .

RUN npm install 
COPY frontend/ ${APP_HOME}

CMD ["npm", "run", "dev"]