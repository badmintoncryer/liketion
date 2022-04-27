import { Request, Response } from "express";

import { Like } from "../database/type";

const db = require("../database/create");
const sendError = require("../util/sendError");

/**
 * Function to determine whether the parameters for retrieving a like in the DB are incomplete.
 *
 * @param {string} contentId - The content ID.
 * @return {boolean}
 */
const isParameterInvalid = (contentId: string): boolean => {
  return typeof contentId !== "string" || contentId.length > 255 || contentId.length === 0;
};

/**
 * Function to retrieve a list of likes
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {void}
 */
const getLikes = (req: Request, res: Response): void => {
  const contentId: string = req.params.id;
  if (isParameterInvalid(contentId)) {
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
