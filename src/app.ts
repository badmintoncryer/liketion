import cors from "cors";

const rootDir = require("app-root-path");
const express = require("express");

const deleteLike = require("./api/deleteLike");
const getHello = require("./api/getHello");
const getLikes = require("./api/getLikes");
const postLike = require("./api/postLike");

/**
 * List of settings.
 *
 * @interface loadSettingsReturn
 */
interface loadSettingsReturn {
  port: number;
  rootPath: string;
}

/**
 * Function to load settings from settings.yaml.
 *
 * @return {loadSettingsReturn}
 */
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
/**
 * Function to retrieve rootUrl
 *
 * @param {getRootUrlProps} settings - The settings.
 * @return {string} - The rootUrl.
 */
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

const app = express();
// CORS対応
// TODO allowOriginとか設定出来るようにする
app.use(cors());
//POSTできたりするように（おまじない）
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティング
app.get(rootUrl, getHello);
app.post(rootUrl + "/:id", postLike);
app.get(rootUrl + "/:id", getLikes);
app.delete(rootUrl + "/:id", deleteLike);

module.exports = app;
