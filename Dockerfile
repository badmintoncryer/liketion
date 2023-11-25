# ビルドの実行
FROM node:20.10.0-alpine as build-stage
COPY ./package* ./
COPY ./yarn* ./
RUN yarn
COPY . .
RUN yarn build

# runtime環境の作成
FROM node:20.10.0-alpine
WORKDIR /usr/src/app
COPY --from=build-stage /dist ./dist/
COPY --from=build-stage /node_modules ./node_modules/
COPY ./config ./config/
COPY ./db ./package.json ./
# ECSからEFSマウント時のpermission問題を解決する。
# 現状以下コメントアウトを外すと、生成したsqliteにアクセスできない
# RUN adduser -D myuser \
#   && chown -R myuser /usr/src/app
# USER myuser
EXPOSE 3000
CMD yarn start

