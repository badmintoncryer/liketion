<h2 align="center">
  liketion - Simple container-based "like function" back-end
</h2>

<div align="center">
  <a href="./LICENSE">
    <img alt="LICENSE" src="https://img.shields.io/badge/license-MIT-blue.svg?maxAge=43200">
  </a>
</div>

liketion provides a simple container-based back-end for the "like function".
If you want to add a like function to your blog, page or other content,
you can set up a liketion server to manage likes via a REST API.

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Environment](#environment)
  - [Build a docker image](#build-a-docker-image)
  - [docker compose](#docker-compose)
  - [post like example](#post-like-example)
  - [get likes example](#get-likes-example)
- [QuickStart](#quickstart)
  - [Configuration](#configuration)
    - [port](#port)
    - [rootPath](#rootpath)
  - [Running liketion](#running-liketion)
- [Integration](#integration)
  - [postLike](#postlike)
    - [endpoint](#endpoint)
    - [request body parameter](#request-body-parameter)
    - [return](#return)
    - [example](#example)
  - [getLikes](#getlikes)
    - [endpoint](#endpoint-1)
    - [return](#return-1)
      - [like](#like)
    - [example](#example-1)

# Installation

## Environment

```shell
$ docker -v
Docker version 20.10.10, build b485636
```

## Build a docker image

You can get a Docker image by running

```shell
git clone https://github.com/badmintoncryer/liketion.git
cd liketion
docker build . -t liketion
```

And you can use the following command to spawn the Docker container.
At this time, set the /path/to/db to the appropriate one.

```shell
docker run -d --rm --name liketion -p 127.0.0.1:3000:3000 -v /path/to/db:/usr/src/app/db -v /usr/src/node_modules liketion
```

## docker compose

If you want to get up and running quickly, you can also run the following command using docker compose.

```shell
git clone https://github.com/badmintoncryer/liketion.git
cd liketion
docker compose up
```

## post like example

```shell
curl -X POST -H "Content-Type: application/json" -d '{"name": "user name"}' http://localhost:3000/root_path/postLike/unique_id
```

## get likes example

```shell
curl http://loaclhost:3000/root_path/getLikes/unique_id
```

# QuickStart

## Configuration

Various settings can be described in /config/settings.yaml

### port

Specifies the port number to listen on.

### rootPath

Specify a path relative to the root domain to listen.
For example, to listen at <https://example.com/liketion>, specify `rootPath: '/liketion'`.

Note that the path should not end with a '/'.

## Running liketion

To run liketion, simply execute

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

API to register a like. Registration in the DB as a pair of unique IDs and names. For example, it is assumed that part of the URL of the blog page is used for the ID.

### endpoint

```shell
POST https://example.com/{ROOT_PATH}/postLike/${id}
```

### request body parameter

| key  | value    |
| ---- | -------- |
| name | [string] |

### return

| key       | value                        | description                                                                                          |
| --------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| status    | "OK" or "Already Registered" | If a registration with the same id and name has already been made, "Already Registered" is returned. |
| contentId | id [string]                  | Path parameters (id) when carrying out a POST request.                                               |
| name      | [string]                     | Request body (name) when POST request is carried out.                                                |

### example

```shell
$ POST https://example.com/root_path/postLike/page_１ {"name": "Taro"}
{
    "status": "OK",
    "contentId": "page_1",
    "name": "Taro"
}

// Execute the same request again.
$ POST https://example.com/root_path/postLike/page_１ {"name": "Taro"}
{
    "status": "Already Registered",
    "contentId": "hoge",
    "name": "taro"
}

```

## getLikes

API to get the list of likes associated with a unique ID as an array.

### endpoint

```shell
GET https://example.com/{ROOT_PATH}/getLikes/${id}
```

### return

| key    | value                        | description                                                                                          |
| ------ | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| status | "OK" or "Already Registered" | If a registration with the same id and name has already been made, "Already Registered" is returned. |
| likes  | array of like                | Array of likes, with details of the likes described below.                                           |

#### like

| key       | value    | description                                            |
| --------- | -------- | ------------------------------------------------------ |
| id        | [number] | Primary key value.                                     |
| contentId | [string] | Path parameters (id) when carrying out a POST request. |
| name      | [string] | Name of the user who made the like                     |

### example

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
