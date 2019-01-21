import { Request, Response, NextFunction } from "express";
import * as passport from "passport";
import { responseData } from './response';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (user) {
      next();
    } else {
      const { name = ''} = info;
      const msg = name === 'TokenExpiredError' ? 'token已过期' : 'token不存在';
      responseData(401, res, -1, msg);
    }
  })(req, res, next);
};
