const express = require("express");

const getHello = require("./api/getHello");

const app = express();

app.get("/", getHello);

module.exports = app;
