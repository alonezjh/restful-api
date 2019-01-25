import { Request, Response } from 'express';
import * as passport from 'passport';
import { UserController } from '../controllers/userController';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { responseData, verifyToken, upload } from '../utils';
import * as multer from 'multer';
import * as path from 'path';

export class Routes {

  public userController: UserController = new UserController();
  public authController: AuthController = new AuthController();
  public authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    this.authMiddleware.authenticate(passport);
  }

  public routes = (app): void => {

    app.route('/').get((req, res) => {
      res.type('text/html');
      res.sendfile('public/index.html');
    });

    /**
     * @api {POST} /user/register 1.用户注册
     * @apiDescription 用户进行注册
     * @apiSampleRequest /api/user/register
     * @apiGroup User
     * @apiPermission none
     *
     * @apiParam {String} email （必填）注册邮箱
     * @apiParam {String} password （必填）用户密码，长度6-16位之间
     * @apiParam {String} captcha （必填）验证码
     *
     * @apiSuccess {String} id 用户id
     * @apiSuccess {String} email 注册邮箱
     * @apiSuccess {String} nickName 用户昵称
     * @apiSuccess {String} address 用户地址
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/user/register`).post(this.userController.register);

    /**
     * @api {POST} /user/login 2.用户登录
     * @apiDescription 用户进行登录
     * @apiSampleRequest /api/user/login
     * @apiGroup User
     * @apiPermission none
     *
     * @apiParam {String} email （必填）用户邮箱
     * @apiParam {String} password （必填）用户密码
     *
     * @apiSuccess {String} id 用户id
     * @apiSuccess {String} email 用户邮箱
     * @apiSuccess {Lang} expiresIn token过期时间（秒）
     * @apiSuccess {String} token token参数
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/user/login`).post(this.userController.login);

    /**
     * @api {GET} /user/:userId 3.查询用户
     * @apiDescription 根据id获取用户信息
     * @apiSampleRequest /api/user/:userId
     * @apiGroup User
     * @apiPermission none
     *
     * @apiHeader {String} Authorization （必填）token验证参数
     *
     * @apiSuccess {String} id 用户id
     * @apiSuccess {String} email 用户邮箱
     * @apiSuccess {String} nickName 用户昵称
     * @apiSuccess {String} address 用户地址
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/user/:userId`).get(verifyToken, this.userController.getUserById);

    /**
     * @api {PUT} /user/:userId 4.更新用户
     * @apiDescription 根据id更新用户信息
     * @apiSampleRequest /api/user/:userId
     * @apiGroup User
     * @apiPermission none
     *
     * @apiHeader {String} Authorization （必填）token验证参数
     *
     * @apiParam {String} nickName 用户昵称
     *
     * @apiSuccess {String} id 用户id
     * @apiSuccess {String} email 用户邮箱
     * @apiSuccess {String} nickName 用户昵称
     * @apiSuccess {String} address 用户地址
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/user/:userId`).put(verifyToken, this.userController.updateUserById);

    /**
     * @api {DELETE} /user/:userId 5.删除用户
     * @apiDescription 根据id删除用户
     * @apiSampleRequest /api/user/:userId
     * @apiGroup User
     * @apiPermission none
     *
     * @apiHeader {String} Authorization （必填）token验证参数
     *
     * @apiParam {String} id 用户id
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/user/:userId`).delete(verifyToken, this.userController.deleteUserById);

    /**
     * @api {GET} /users 6.用户列表
     * @apiDescription 获取用户列表
     * @apiSampleRequest /api/users
     * @apiGroup User
     * @apiPermission none
     *
     * @apiHeader {String} Authorization （必填）token验证参数
     *
     * @apiSuccess {Array} data 用户列表
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/users`).get(verifyToken, this.userController.getUsers);

    /**
     * @api {GET} /auth/captcha 获取验证码
     * @apiDescription 获取验证码
     * @apiSampleRequest /api/auth/captcha
     * @apiGroup Auth
     * @apiPermission none
     *
     * @apiSuccess {Svg} captcha 验证码svg图片
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/auth/captcha`).get(this.authController.getCaptcha);

    /**
     * @api {POST} /upload/singleImg 单图上传
     * @apiDescription 单张图片上传
     * @apiGroup Upload
     * @apiPermission none
     *
     * @apiParam {File} img  图片文件（只允许上传jpg/png格式且图片大小不超过2M）
     *
     * @apiSuccess {String} imgUrl 返回的图片相对地址
     *
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     *    code: 0,
     *    msg: "上传成功",
     *    data: {
     *        "imgUrl": "public/uploads/201901/1548407905324.jpg",
     *    }
     * }
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/upload/singleImg`).post((req, res) => {
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          const { code = ''} = err;
          if (code === 'LIMIT_FILE_SIZE') {
            responseData(400, res, -1, '图片大小超出限制，不能超过2M');
          }
        } else if (err) {
          responseData(400, res, -1, '图片类型不正确，只能上传jpg/png格式图片', { errMsg: err });
        } else {
          responseData(200, res, 0, '上传成功', { imgUrl: req.file.path });
        }
      });
    });

    app.use(`*`, (req: Request, res: Response) => responseData(404, res, -1, '无效的请求'));
  }
}
