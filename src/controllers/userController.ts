import * as mongoose from 'mongoose';
import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { UserSchema } from '../models/user';
import { responseData, validation } from '../utils';

const User = mongoose.model('User', UserSchema);

export class UserController {

  public register = (req: Request, res: Response) => {
    const { email = '', password = '' } = req.body;
    const validate = validation.registerValidate(req.body);
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

}
