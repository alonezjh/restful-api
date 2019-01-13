import { Request, Response, NextFunction } from 'express';
import * as passport from "passport";
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { responseData, verifyToken } from '../utils';

export class Routes {

  public userController: UserController = new UserController();
  public auth: AuthMiddleware = new AuthMiddleware();

  constructor() {
    this.auth.authenticate(passport);
  }

  public routes = (app): void => {

    /**
     * @api {GET} /test 测试接口
     * @apiDescription 用于对接口进行测试
     * @apiSampleRequest /api/test
     * @apiGroup Test
     * @apiVersion 1.0.0
     */
    app.route(`/api/test`).get((req: Request, res: Response) => responseData(200, res, 0, 'testapi is successful'));

    /**
     * @api {POST} /user/register 用户注册
     * @apiDescription 用户进行注册
     * @apiSampleRequest /api/user/register
     * @apiGroup User
     * @apiPermission none
     *
     * @apiParam {String} email （必填）注册邮箱
     * @apiParam {String} password （必填）用户密码，长度6-16位之间
     *
     * @apiSuccess {String} id 用户id
     * @apiSuccess {String} email 注册邮箱
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/user/register`).post(this.userController.register);

    /**
     * @api {POST} /user/login 用户登录
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
     * @api {GET} /user/:userId 获取用户信息
     * @apiDescription 根据id获取用户信息
     * @apiSampleRequest /api/user/:userId
     * @apiGroup User
     * @apiPermission none
     *
     * @apiHeader {String} Authorization token验证参数
     * @apiSuccess {String} id 用户id
     * @apiSuccess {String} email 用户邮箱
     *
     * @apiVersion 1.0.0
     */
    app.route(`/api/user/:userId`).get(verifyToken, this.userController.getUserById);

    app.use(`*`, (req: Request, res: Response) => responseData(404, res, -1, '无效的请求'));
  }
}
