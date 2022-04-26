import { Request, Response } from "express";

const db = require("../database/create");

type Like = {
  id: number;
  contentId: string;
};

const sendError = (res: Response, status: number, message: string): void => {
  console.error("database error: " + message);
  res.status(status).json({
    status: "database error",
    message: message,
  });
};

// いいねを登録する
// TODO 同一の名前が登録されている場合、登録を行わない
const postLike = (req: Request, res: Response): void => {
  const contentId: string = req.params.id;
  const name: string = req.body.name;
  // 同一のcontentId, nameの組み合わせでの登録が行われているかを確認
  db.all(
    "select * from likes where contentId = ? and name = ?",
    contentId,
    name,
    (error: { message: string }, row: Like[]) => {
      if (error) {
        sendError(res, 500, error.message);
      } else {
        // 同一の名前が登録されていない場合、登録を行う
        if (row.length === 0) {
          db.run("insert into likes(contentId,name) values(?,?)", contentId, name, (error: { message: string }) => {
            if (error) {
              sendError(res, 500, error.message);
            } else {
              res.status(200).json({
                status: "OK",
                contentId: contentId,
                name: name,
              });
            }
          });
          // 同一の名前が登録されている場合、登録を行わない
        } else {
          res.status(200).json({
            status: "Already Registered",
            contentId: contentId,
            name: name,
          });
        }
      }
    }
  );
};

module.exports = postLike;
