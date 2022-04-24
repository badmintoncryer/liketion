import { Request, Response } from "express";

const getLikes = (_req: Request, res: Response): void => {
  res.json({
    total: 6,
    names: ["taro", "jiro", "saburo", "shiro", "goro", "kazuho"],
  });
};

module.exports = getLikes;
