const rootDir = require("app-root-path");
const express = require("express");

const getHello = require("./api/getHello");
const postLike = require("./api/postLike");

interface loadSettingsReturn {
  port: number;
  rootPath: string;
}
// yamlから設定をロード
const loadSettings = (): loadSettingsReturn => {
  const fs = require("fs");
  const yaml = require("js-yaml");
  const yamlText = fs.readFileSync(`${rootDir}/config/settings.yaml`, "utf8");
  return yaml.load(yamlText);
};

interface getRootUrlProps {
  port: number;
  rootPath: string;
}
const getRootUrl = (settings: getRootUrlProps): string => {
  return settings.rootPath || "/";
};
// ルートパスの設定
let rootUrl = "/";
try {
  rootUrl = getRootUrl(loadSettings());
} catch (error) {
  console.error(error);
}

// ルーティング
const app = express();
app.get(rootUrl, getHello);
app.post(rootUrl + "/postLike/:id", postLike);

module.exports = app;
