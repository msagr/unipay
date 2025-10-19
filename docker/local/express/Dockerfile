ARG NODE_VERSION=22.19.0

FROM node:${NODE_VERSION}

LABEL name="unipay"
LABEL license="MIT"
LABEL description="Unipay Express Server"
LABEL version="1.0.0"

ENV NODE_ENV=development
ENV PORT=3000

ARG APP_HOME=/app 
WORKDIR ${APP_HOME}

RUN addgroup --system unipay \
    && useradd --system --gid unipay unipay

COPY backend/package*.json .

RUN npm install
COPY --chown=unipay:unipay backend/ ${APP_HOME}

RUN chown -R unipay:unipay ${APP_HOME}
USER unipay

CMD ["npm", "run", "dev"]