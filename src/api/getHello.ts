import { Request, Response } from "express";

/**
 * Functions to check operation
 *
 * @param {Request} _req
 * @param {Response} res
 */
const getHello = (_req: Request, res: Response): void => {
  console.log("getHello is called");
  res.send("Liketion is working properly.");
};

module.exports = getHello;
