FROM node:14

ENV APP_HOME=/home/app

RUN mkdir -p $APP_HOME && useradd -u 1001 app && chown -R app:app $APP_HOME

WORKDIR $APP_HOME

COPY --chown=app:app package.json ./
COPY --chown=app:app yarn.lock ./

RUN yarn install --network-timeout 1000000 && chown -R app:app node_modules

COPY --chown=app:app . .

USER app

EXPOSE 3000

CMD ["yarn", "start"]
