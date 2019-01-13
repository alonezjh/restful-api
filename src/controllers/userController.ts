import * as mongoose from 'mongoose';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import { Request, Response } from "express";
import { UserSchema } from '../models/user';
import { responseData, validation } from '../utils';

dotenv.config();

const User = mongoose.model('User', UserSchema);

export class UserController {

  public register = (req: Request, res: Response) => {
    const { email = '', password = '' } = req.body;
    const validate = validation.userValidate(req.body);
    User.findOne({ email })
    .then(user => {
      if (user) {
        responseData(400, res, -1, `邮箱: ${email} 已经被注册`);
      } else {
        if (Object.keys(validate).length > 0) {
          responseData(400, res, -1, validate);
          return false;
        }
        const userInfo: any = new User({ email, password });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(userInfo.password, salt, (err, hash) => {
            if (err) throw err;
            userInfo.password = hash;
            userInfo
            .save()
            .then(user => {
              const { _id: id, email} = user;
              responseData(200, res, 0, '注册成功', { id, email});
            })
            .catch(err => console.error(err));
          });
        });
      }
    })
    .catch( err => {
      console.log(`register failed => ${err}`);
    });
  }

  public login = (req: Request, res: Response) => {
    const { email = '', password = '' } = req.body;
    const validate = validation.userValidate(req.body);
    if (Object.keys(validate).length > 0) {
      responseData(400, res, -1, validate);
      return false;
    }
    User.findOne({ email })
    .then((user: any) => {
      const { _id: id = '' } = user;
      if (!user) {
        responseData(400, res, -1, `邮箱: ${email} 不存在`);
      } else {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const payload = { id: user._id };
            const secretOrKey = process.env.SECRET_KEY;
            const expiresIn = 60 * 60 * 24 * 7;
            jwt.sign(payload, secretOrKey, { expiresIn }, (err, token) => {
              if (err) throw err;
              responseData(200, res, 0, `登录成功`,
              {
                id,
                email,
                expiresIn,
                token: `Bearer ${token}`,
              });
            });
          } else {
            responseData(400, res, -1, `密码不正确`);
          }
        });
      }
    })
    .catch( err => {
      console.log(`login failed => ${err}`);
    });
  }

  public getUserById = (req: Request, res: Response) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        responseData(400, res, -1, '用户不存在');
      } else {
        const { _id: id = '', email = '' } = user as any;
        const data = { id, email };
        responseData(200, res, 0, '获取用户信息成功', data);
      }
    });
  }
}
