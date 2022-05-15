# ビルドの実行
FROM node:16.13.1-alpine as build-stage
COPY ./package* ./
COPY ./yarn* ./
RUN yarn
COPY . .
RUN yarn build

# runtime環境の作成
FROM node:16.13.1-alpine
WORKDIR /usr/src/app
RUN adduser -D myuser \
  && chown -R myuser /usr/src/app
USER myuser
COPY --from=build-stage /dist ./dist/
COPY --from=build-stage /node_modules ./node_modules/
COPY ./config ./config/
COPY ./db ./package.json ./
EXPOSE 3000
CMD yarn start

