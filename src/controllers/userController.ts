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
    const { email = '', captcha = '' } = req.body;
    const { session = '' } = req as any;
    const sessionCaptcha = session.captcha;
    if (captcha === '') {
      responseData(400, res, -1, `验证码不能为空`);
      return;
    }
    if (captcha.toLowerCase() !== sessionCaptcha) {
      responseData(400, res, -1, `验证码不正确`);
      return;
    }
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
        const userInfo: any = new User(req.body);
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(userInfo.password, salt, (err, hash) => {
            if (err) throw err;
            userInfo.password = hash;
            userInfo
            .save()
            .then(user => {
              const { _id, email, nickName = '', avatar = '', mobile = '', address = ''} = user;
              responseData(200, res, 0, '注册成功', { _id, email, nickName, avatar, mobile, address });
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
            const expiresIn = 60;
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
      responseData(400, res, -1, '登录失败');
    });
  }

  public getUserById = (req: Request, res: Response) => {
    User.findById( req.params.userId, (err, user) => {
      if (err) {
        responseData(400, res, -1, '用户不存在');
      } else {
        const { _id = '', email = '', nickName = '', createTime = '' } = user as any;
        const data = { _id, email, nickName, createTime };
        responseData(200, res, 0, '获取用户信息成功', data);
      }
    });
  }

  public updateUserById = (req: Request, res: Response) => {
    const { userId: _id } = req.params;
    const { nickName = '', mobile = '' } = req.body;
    const newUser = {} as any;
    if (nickName !== '') {
      newUser.nickName = nickName;
    }
    if (mobile !== '') {
      newUser.mobile = mobile;
    }
    User.findByIdAndUpdate( { _id }, newUser, { new: true })
    .then(users => responseData(200, res, 0, '更新用户信息成功', users))
    .catch(err => responseData(400, res, -1, '更新用户信息失败', { errMsg: err.message }));
  }

  public deleteUserById = (req: Request, res: Response) => {
    const { userId: _id = '' } = req.params;
    User.deleteOne({ _id })
    .then(err => {
      const { n = 0, ok = 0 } = err;
      if ( n === 1 && ok === 1 ) {
        responseData(200, res, 0, '删除用户成功');
      } else if ( n === 0 && ok === 1 ) {
        responseData(400, res, -1, '该用户已被删除');
      } else {
        responseData(400, res, -1, '该用户不存在');
      }
    })
    .catch(err => responseData(400, res, -1, '删除用户失败', { errMsg: err.message }));
  }

  public getUsers = (req: Request, res: Response) => {
    User.find({}, { password: 0, __v: 0 })
    .then(users => responseData(200, res, 0, '获取用户列表成功', users))
    .catch(err => responseData(400, res, -1, '获取用户列表失败', { errMsg: err.message }));
  }
}
