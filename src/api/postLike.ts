import { Request, Response } from "express";

const db = require("../database/create");

// いいねを登録する
// TODO 同一の名前が登録されている場合、登録を行わない
const postLike = (req: Request, res: Response): void => {
  const contentId: string = req.params.id;
  const name: string = req.body.name;
  const stmt = db.prepare("insert into likes (contentId,name) values (?,?)");
  stmt.run(contentId, name, (error: { message: string }) => {
    if (error) {
      res.status(500).json({
        status: "database error",
        message: error.message,
      });
      return;
    } else {
      res.status(200).json({
        status: "OK",
        contentId: contentId,
        name: name,
      });
    }
  });
};

module.exports = postLike;
