import { Buffer } from "buffer";

import { Request, Response } from "express";

import { Like } from "../database/type";

const db = require("../database/create");
const sendError = require("../util/sendError");

/**
 * Function to determine whether the parameters for registering a like in the DB are incomplete.
 *
 * @param {string} contentId - The content ID.
 * @param {string} name - The user name.
 * @return {boolean}
 */
const isParameterInvalid = (contentId: string, name: string): boolean => {
  return (
    typeof contentId !== "string" ||
    typeof name !== "string" ||
    contentId.length > 255 ||
    name.length > 64 ||
    contentId.length === 0 ||
    name.length === 0
  );
};

/**
 * Function to retrieve username and email from the credentials granted
 * by AWS Application Load Balancer.
 *
 * @param {Request} req - The request object.
 * @return {{ name: string; email: string }} - The username and email.
 */
const getUserInfo = (req: Request): { name: string; email: string } => {
  console.log("getUserInfo is called");
  const oidcData = req.headers["x-amzn-oidc-data"];
  console.log("oidcData is: ", oidcData);
  if (oidcData && typeof oidcData === "string") {
    // JWT形式の文字列からpayloadを取得
    const payload = oidcData.split(".")[1];
    // payloadをdecodeしてjson形式に変換
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));

    // TODO decoded.nameからdecoded.usernameに変換する必要があるかも。
    // TODO ALBが付与するx-amzn-oidc-dataの仕様を確認する
    return { name: decoded.name || "", email: decoded.email || "" };
  } else {
    return { name: "", email: "" };
  }
};

/**
 * Function to register a like.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {void}
 */
const postLike = (req: Request, res: Response): void => {
  console.log("postLike is called");
  const { name, email } = getUserInfo(req);
  const contentId: string = req.params.id;
  // x-amzn-oidc-dataに含まれるname > email > body.nameの優先度でuserNameを決定する
  const userName: string = name || email || req.body.name;
  // パラメータのチェック
  if (isParameterInvalid(contentId, userName)) {
    sendError(res, 400, "invalid request");
    return;
  }
  // 同一のcontentId, nameの組み合わせでの登録が行われているかを確認
  db.all(
    "select * from likes where contentId = ? and name = ?",
    contentId,
    userName,
    (error: { message: string }, row: Like[]) => {
      if (error) {
        sendError(res, 500, error.message);
      } else {
        // 同一の名前が登録されていない場合、登録を行う
        if (row.length === 0) {
          db.run("insert into likes(contentId,name) values(?,?)", contentId, userName, (error: { message: string }) => {
            if (error) {
              sendError(res, 500, error.message);
            } else {
              console.log({
                contentId: contentId,
                name: userName,
              });
              res.status(200).json({
                status: "OK",
                contentId: contentId,
                name: userName,
              });
            }
          });
          // 同一の名前が登録されている場合、登録を行わない
        } else {
          res.status(200).json({
            status: "Already Registered",
            contentId: contentId,
            name: userName,
          });
        }
      }
    }
  );
};

module.exports = postLike;
