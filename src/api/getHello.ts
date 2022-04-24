import { Request, Response } from "express";

const getHello = (_req: Request, res: Response): void => {
  res.send("hello!");
};

module.exports = getHello;
