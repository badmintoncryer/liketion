import { Response } from "express";

const sendError = (res: Response, status: number, message: string): void => {
  console.error("database error: " + message);
  res.status(status).json({
    status: "database error",
    message: message,
  });
};

module.exports = sendError;
