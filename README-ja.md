<div align="center">
  <a href="https://github.com/badmintoncryer/liketion">
    <img alt="liketion" src="https://user-images.githubusercontent.com/64848616/167088980-ebf3d287-889e-4529-bc65-4bf066052b00.png">
  </a>
</div>

<h2 align="center">
  liketion - Simple container-based "like button" back-end
</h2>

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://open.vscode.dev/badmintoncryer/liketion)
![example workflow](https://github.com/badmintoncryer/liketion/actions/workflows/test.yaml/badge.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/badmintoncryer/liketion/issues)
![Coverage:lines](coverage/badge-lines.svg)
![Coverage:functions](coverage/badge-functions.svg)
![Coverage:branches](coverage/badge-branches.svg)
![Coverage:statements](coverage/badge-statements.svg)
![Licence](https://img.shields.io/badge/license-MIT-blue.svg?maxAge=43200)

[ [English](README.md) | 日本語版 ]

liketion はコンテナベースのシンプルなイイね機能バックエンドを提供します。
ブログや個人ページなどにイイね機能を導入したい場合、liketion サーバにより REST API 経由でイイね管理を行えます。

# 目次

- [目次](#目次)
- [インストール](#インストール)
  - [動作環境](#動作環境)
  - [docker image のビルド](#docker-image-のビルド)
  - [docker compose](#docker-compose)
  - [いいね登録の例](#いいね登録の例)
  - [いいね取得の例](#いいね取得の例)
- [QuickStart](#quickstart)
  - [設定](#設定)
    - [port](#port)
    - [rootPath](#rootpath)
  - [Running liketion](#running-liketion)
- [Integration](#integration)
  - [postLike](#postlike)
    - [endpoint](#endpoint)
    - [リクエストボディパラメータ](#リクエストボディパラメータ)
    - [return](#return)
    - [例](#例)
  - [getLikes](#getlikes)
    - [endpoint](#endpoint-1)
    - [return](#return-1)
      - [like](#like)
    - [例](#例-1)
- [認証付き ALB との連携](#認証付き-alb-との連携)
  - [使い方](#使い方)
    - [使用例](#使用例)
      - [例 1](#例-1)
      - [例 2](#例-2)
      - [例 3](#例-3)

# インストール

## 動作環境

```shell
$ docker -v
Docker version 20.10.10, build b485636
```

## docker image のビルド

以下コマンドにより docker image をビルドできます。

```shell
git clone https://github.com/badmintoncryer/liketion.git
cd liketion
docker build . -t liketion
```

また、以下コマンドから docker コンテナを起動させることができます。
この時、/path/to/db は適切なものに変更して下さい。(DB には SQLite を用いているため、永続化を行うディレクトリを指定する必要があります。)

```shell
docker run -d --rm --name liketion -p 127.0.0.1:3000:3000 -v /path/to/db:/usr/src/app/db -v /usr/src/node_modules liketion
```

## docker compose

細かいことは気にせずとりあえず動かしてみたい。という方は、以下の docker compose コマンドを試してみて下さい。

```shell
git clone https://github.com/badmintoncryer/liketion.git
cd liketion
docker compose up
```

## いいね登録の例

```shell
curl -X POST -H "Content-Type: application/json" -d '{"name": "user name"}' http://localhost:3000/root_path/postLike/unique_id
```

## いいね取得の例

```shell
curl http://loaclhost:3000/root_path/getLikes/unique_id
```

# QuickStart

## 設定

各種設定は /config/settings.yaml で行います。

### port

liketion が listen するポート番号を設定します。
初期値は 3000 です。

### rootPath

liketion が listen するルートパスを設定します。
例えば、https://example.com/liketionをルートとしたい場合、`rootPath: '/liketion'`.と設定して下さい。
この時パス末尾のスラッシュは不要です。

## Running liketion

liketion を動かしたい場合、以下コマンドで実行可能です。

```shell
docker compose up
```

or

```shell
docker build . -t liketion
docker run -d --rm --name liketion -p 127.0.0.1:3000:3000 -v /path/to/db:/usr/src/app/db -v /usr/src/node_modules liketion
```

or

```shell
yarn dev
```

# Integration

## postLike

いいねを登録するための API です。ユニーク ID とユーザ名をペアとして、DB への登録を行います。
ブログページの URL など、一意な文字列をユニーク ID とすることを想定しています。

### endpoint

```shell
POST https://example.com/{ROOT_PATH}/postLike/${id}
```

### リクエストボディパラメータ

| key  | value    |
| ---- | -------- |
| name | [string] |

### return

| key       | value                        | description                                                                           |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| status    | "OK" or "Already Registered" | 既に同一の id, naem の組が DB に登録されている場合、"Already Registered" が返される。 |
| contentId | id [string]                  | ユニーク ID として用いられたパスパラメータ                                            |
| name      | [string]                     | 名前として用いられたリクエストボディのパラメータ                                      |

### 例

```shell
$ POST https://example.com/root_path/postLike/page_１ {"name": "Taro"}
{
    "status": "OK",
    "contentId": "page_1",
    "name": "Taro"
}

// 同一のリクエストを再度実行
$ POST https://example.com/root_path/postLike/page_１ {"name": "Taro"}
{
    "status": "Already Registered",
    "contentId": "hoge",
    "name": "taro"
}

```

## getLikes

ユニーク ID に紐付いたイイね一覧を取得する API

### endpoint

```shell
GET https://example.com/{ROOT_PATH}/getLikes/${id}
```

### return

| key    | value         | description                    |
| ------ | ------------- | ------------------------------ |
| status | "OK"          |                                |
| likes  | array of like | いいねの配列。詳細は以下に記載 |

#### like

| key       | value    | description                                 |
| --------- | -------- | ------------------------------------------- |
| id        | [number] | DB の主キーの値                             |
| contentId | [string] | ユニーク ID。(パスパラメータで渡されたもの) |
| name      | [string] | ユーザ名                                    |

### 例

```shell
$ GET https://example.com/root_path/postLike/page_１
{
  "status": "OK",
  "likes":[
    {
      "id":2,
      "contentId":"page_1",
      "name":"Taro"
    },
    {
      "id":3,
      "contentId":"page_1",
      "name":"Jiro"
    }
  ]
}
```

# 認証付き ALB との連携

使用例として、liketion を認証連携済み ALB の後段に設置することがあります。(Elaastic Container Service でも EC2 でも構いません。)
ALB と cognito や AzureAD など IdP を OIDC 連携させ、認証済みユーザによる API リクエストのみを liketion にアクセスさせることが可能です。

<div align="center">
    <img alt="architecture" src="https://user-images.githubusercontent.com/64848616/167089166-de77b67c-82fc-49ba-a68c-84f3882067dd.png">
</div>

[ALB は認証済みユーザ情報を HTTP リクエストのヘッダに付加します。](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html) ユーザ名やメールアドレス等の情報をヘッダから抽出し、postLike 時のユーザ名として用いることが可能です。

## 使い方

postLike 実行時にリクエストボディによる name パラメータを付加しないだけで OK です。

liketion は ALB によって付加された"x-amzn-oidc-data"ヘッダから name, email フィールドを読み取り、これを DB 登録時のユーザ名として用います。

もし name, email いずれも x-amzn-oidc-data に存在した場合、name が優先的に使われます。また、仮にいずれも存在しなかった場合、リクエストボディの name パラメータが用いられます。

リクエストボディでの name パラメータは常に HTTP リクエストに載っけることができますが、基本的に x-amzn-oidc-data の値によって上書きされます。

### 使用例

#### 例 1

```shell
$ POST https://example.com/root_path/postLike/page_１ (without request body)

The payload of x-amzn-oidc-data is
{
  sub: '3456789-abcdefg',
  email_verified: 'false',
  name: 'username'
  email: 'test@mail_address.com',
  exp: 1651818337,
  iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_aaaaaaaaa'
}

return is
{
    "status": "OK",
    "contentId": "page_1",
    "name": "username"
}

```

#### 例 2

```shell
$ POST https://example.com/root_path/postLike/page_１ (without request body)

The payload of x-amzn-oidc-data is
{
  sub: '3456789-abcdefg',
  email_verified: 'false',
  email: 'test@mail_address.com',
  exp: 1651818337,
  iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_aaaaaaaaa'
}

return is
{
    "status": "OK",
    "contentId": "page_1",
    "name": "test@mail_address.com"
}
```

#### 例 3

```shell
$ POST https://example.com/root_path/postLike/page_１ {"name": "Taro"}

The payload of x-amzn-oidc-data is
{
  sub: '3456789-abcdefg',
  email_verified: 'false',
  email: 'test@mail_address.com',
  exp: 1651818337,
  iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_aaaaaaaaa'
}

return is
{
    "status": "OK",
    "contentId": "page_1",
    "name": "test@mail_address.com"
}
# 仮にリクエストボディでnameパラメータが指定されている場合でも、
# x-amzn-oidc-dataにemailフィールドが存在するため、値が上書きされている
```
