import { Response } from "express";

export const responseData = (statusCode: number, res: Response, code: number, msg: string, data?: any) =>
  res.status(statusCode).json
  ({
    code,
    msg,
    data,
  });
