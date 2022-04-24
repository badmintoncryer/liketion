import { Request, Response } from "express";

const postLike = (_req: Request, res: Response): void => {
  res.send("your like is successfully registered!");
};

module.exports = postLike;
