import { Request, Response } from "express";
import { Database } from "sqlite3";

import { Like } from "../database/type";
import { getUserInfo } from "../util/getUserInfo";

const db = require("../database/create");
const sendError = require("../util/sendError");

/**
 * Function to determine whether the parameters for registering a like in the DB are incomplete.
 *
 * @param {string} contentId - The content ID.
 * @param {string} name - The user name.
 * @return {boolean}
 */
export const isParameterInvalid = (contentId: string, name: string): boolean => {
  return (
    typeof contentId !== "string" ||
    typeof name !== "string" ||
    contentId.length > 255 ||
    name.length > 64 ||
    contentId.length === 0
  );
};

/**
 * Function to delete all "Likes" associated with a specific contentId.
 *
 * @param {Database} db - The database object.
 * @param {string} contentId - The content ID.
 * @param {Response} res - The response object.
 */
const deleteAllLikes = (db: Database, contentId: string, res: Response): void => {
  db.all("select * from likes where contentId = ?", contentId, (error: { message: string }, row: Like[]) => {
    if (error) {
      sendError(res, 500, error.message);
    } else {
      // 良いねが登録されていない場合、何も行わない
      if (row.length === 0) {
        res.status(200).json({
          status: "Not Registered",
          contentId: contentId,
        });
      } else {
        // contentIdに紐づく全てのイイねを削除する
        db.run("delete from likes where contentId = ?", contentId, (error: { message: string }) => {
          if (error) {
            sendError(res, 500, error.message);
          } else {
            res.status(200).json({
              status: "OK",
              contentId: contentId,
            });
          }
        });
      }
    }
  });
};

/**
 * Function to delete like associated with a specific contentId, userName pair.
 *
 * @param {Database} db - The database object.
 * @param {string} contentId - The content ID.
 * @param {string} userName - The user name.
 * @param {Response} res - The response object.
 */
const deleteSingleLike = (db: Database, contentId: string, userName: string, res: Response): void => {
  db.all(
    "select * from likes where contentId = ? and name = ?",
    contentId,
    userName,
    (error: { message: string }, row: Like[]) => {
      if (error) {
        sendError(res, 500, error.message);
      } else {
        // 登録されていない場合、何も行わない
        if (row.length === 0) {
          res.status(200).json({
            status: "Not Registered",
            contentId: contentId,
            name: userName,
          });
        } else {
          db.run(
            "delete from likes where contentId = ? and name = ?",
            contentId,
            userName,
            (error: { message: string }) => {
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
            }
          );
        }
      }
    }
  );
};

/**
 * Function to delete a registered like.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {void}
 */
const deleteLike = (req: Request, res: Response): void => {
  console.log("deleteLike is called");
  const { name, email } = getUserInfo(req);
  const contentId: string = req.params.id;
  // x-amzn-oidc-dataに含まれるname > email > body.nameの優先度でuserNameを決定する
  // DELETEにリクエストボディを載っけるのは気が引けるが、ぱぱっと作りたかったので我慢
  const userName: string = name || email || req.body.name || "";
  // パラメータのチェック
  if (isParameterInvalid(contentId, userName)) {
    sendError(res, 400, "invalid request");
    return;
  }

  // userNameを空欄でリクエストされた場合、特定のcontentIdのlikeを全て削除する
  if (userName === "") {
    deleteAllLikes(db, contentId, res);
    // userNameを指定してリクエストされた場合、特定のcontentId, userNameの組み合わせのlikeを削除する
  } else {
    deleteSingleLike(db, contentId, userName, res);
  }
};

module.exports = deleteLike;
