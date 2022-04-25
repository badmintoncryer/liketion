import { Request, Response } from "express";

const db = require("../database/create");

type Like = {
  id: number;
  contentId: string;
};

// いいね一覧を取得する
const getLikes = (req: Request, res: Response): void => {
  const contentId: string = req.params.id;
  db.all("select * from likes where contentId = ?", contentId, (error: { message: string }, row: Like[]) => {
    if (error) {
      console.error("database error: " + error.message);
      res.status(500).json({
        status: "database error",
        message: error.message,
      });
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
