// import { createDbConnection, getRandomDbPath } from "./tests/setup/database";
const fs = require("fs");

const rootDir = require("app-root-path");
const yaml = require("js-yaml");
const request = require("supertest");

const testServer = require("../server");

jest.mock("../database/create");

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
export const loadSettings = (): loadSettingsReturn => {
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
export const getRootUrl = (settings: getRootUrlProps): string => {
  return settings.rootPath || "/";
};

afterAll(() => {
  testServer.close();
  // testに用いたDBの削除
  try {
    fs.unlinkSync("./src/tests/test.sqlite");
  } catch (error) {
    console.log(error);
  }
});

describe("APIのテスト", () => {
  describe("getHelloのテスト", () => {
    test("レスポンスが適切な値を持っていることを確認", async () => {
      const rootUrl = getRootUrl(loadSettings());
      const response = await request(testServer).get(rootUrl);
      expect(response.text).toBe("Liketion is working properly.");
      expect(response.statusCode).toBe(200);
    });
  });
  describe("postLikeのテスト", () => {
    test("正常登録のテスト_1", async () => {
      const rootUrl = getRootUrl(loadSettings());
      const response = await request(testServer)
        .post(rootUrl + "/postLike/1")
        .send({
          name: "test user",
          contentId: "hogehoge",
        });
      expect(response.text).toBe('{"status":"OK","contentId":"1","name":"test user"}');
    });
    test("正常登録のテスト_2", async () => {
      const rootUrl = getRootUrl(loadSettings());
      const response = await request(testServer)
        .post(rootUrl + "/postLike/1")
        .send({
          name: "test user2",
          contentId: "hogehoge",
        });
      expect(response.text).toBe('{"status":"OK","contentId":"1","name":"test user2"}');
    });
    test("既に登録されているデータを再登録するテスト", async () => {
      const rootUrl = getRootUrl(loadSettings());
      const response = await request(testServer)
        .post(rootUrl + "/postLike/1")
        .send({
          name: "test user",
          contentId: "hogehoge",
        });
      expect(response.text).toBe('{"status":"Already Registered","contentId":"1","name":"test user"}');
    });
    test("登録失敗するテスト", async () => {
      const rootUrl = getRootUrl(loadSettings());
      const response = await request(testServer)
        .post(rootUrl + "/postLike/1")
        .send({
          name: "test userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
          contentId: "hogehoge",
        });
      expect(response.text).toBe('{"status":"database error","message":"invalid request"}');
    });
  });
  describe("getLikesのテスト", () => {
    test("正常取得のテスト_1", async () => {
      const rootUrl = getRootUrl(loadSettings());
      const response = await request(testServer).get(rootUrl + "/getLikes/1");
      expect(response.text).toBe(
        '{"status":"OK","likes":[{"id":1,"contentId":"1","name":"test user"},{"id":2,"contentId":"1","name":"test user2"}]}'
      );
    });
    test("空データの取得テスト", async () => {
      const rootUrl = getRootUrl(loadSettings());
      const response = await request(testServer).get(rootUrl + "/getLikes/2");
      expect(response.text).toBe('{"status":"OK","likes":[]}');
    });
  });
});
