import { Response } from "express";

/**
 * Function that return an error message when an error occurs.
 *
 * @param {Response} res - The response object.
 * @param {number} status - The status code.
 * @param {string} message - The error message.
 */
const sendError = (res: Response, status: number, message: string): void => {
  console.log("sendError is called");
  console.log(res);
  console.error("database error: " + message);
  res.status(status).json({
    status: "database error",
    message: message,
  });
};

module.exports = sendError;
