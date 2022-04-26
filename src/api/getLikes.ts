import { Request, Response } from "express";

import { Like } from "../database/type";

const db = require("../database/create");
const sendError = require("../util/sendError");

// いいね一覧を取得する
const getLikes = (req: Request, res: Response): void => {
  const contentId: string = req.params.id;
  if (typeof contentId !== "string") {
    res.status(400).json({
      status: "invalid request",
    });
    return;
  }
  // contentIdに紐づくいいねを取得
  db.all("select * from likes where contentId = ?", contentId, (error: { message: string }, row: Like[]) => {
    if (error) {
      sendError(res, 500, error.message);
    } else {
      console.log(row);
      res.status(200).json({
        status: "OK",
        likes: row,
      });
    }
  });
};

module.exports = getLikes;
