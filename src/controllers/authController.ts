import { Request, Response } from 'express';
import * as svgCaptcha from 'svg-captcha';
import { responseData } from '../utils';

export class AuthController {

  public getCaptcha = (req: Request, res: Response) => {
    const option = {
      size: 6,  // 验证码长度
      width: 200,
      height: 50,
      background: "#f4f3f2", // 干扰线条颜色
      noise: 5,
      fontSize: 26,
      ignoreChars: '0o1i',  // 验证码字符中排除'0o1i'
      color: true,  // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    };
    const code = svgCaptcha.create(option);
    const { session = '' } = req as any;
    console.log(code.text.toLowerCase());
    session.captcha = code.text.toLowerCase();
    responseData(200, res, 0, '验证码获取成功', { captcha: code.data });
  }

}
