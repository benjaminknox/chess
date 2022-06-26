FROM node:14

ENV APP_HOME=/home/app
ENV NODE_ENV=production

RUN mkdir -p $APP_HOME && useradd -u 1001 app && chown -R app:app $APP_HOME

WORKDIR $APP_HOME

COPY --chown=app:app package.json ./
COPY --chown=app:app yarn.lock ./

RUN yarn global add serve && NODE_ENV=production yarn install --network-timeout 1000000 && chown -R app:app node_modules

COPY --chown=app:app . .

RUN yarn build && chown -R app:app $APP_HOME/build

USER app

EXPOSE 3000

CMD ["serve", "-s", "build"]
