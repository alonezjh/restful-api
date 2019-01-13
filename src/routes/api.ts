import { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { responseData } from '../utils';

export class Routes {

  public userController: UserController = new UserController();

  public routes = (app): void => {

    /**
     * @api {GET} /test 测试接口
     * @apiDescription 用于对接口进行测试
     * @apiName test
     * @apiSampleRequest /api/test
     * @apiGroup Test
     * @apiVersion 1.0.0
     */
    app.route(`/api/test`).get((req: Request, res: Response) => responseData(200, res, 0, 'testapi is successful'));

    /**
     * @api {POST} /user/register 用户注册
     * @apiDescription 用户进行注册
     * @apiName register
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

    app.use(`*`, (req: Request, res: Response) => responseData(404, res, -1, '无效的请求'));
  }
}
