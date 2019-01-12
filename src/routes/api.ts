import { Request, Response } from "express";

export class Routes {

  public routes = (app): void => {

    /**
     * 测试接口
     * @api {GET} /test 测试接口
     * @apiDescription 用于对接口进行测试
     * @apiName test
     * @apiSampleRequest /api/test
     * @apiGroup Test
     * @apiVersion 1.0.0
     */
    app.route(`/api/test`).get((req: Request, res: Response) => {
      res.status(200).send({
        code: 0,
        msg: 'successful',
        data: '',
      });
    });

    app.use('*', (req: Request, res: Response) => {
      res.status(400).json({
        code: -1,
        msg: '资源不存在',
        data: '',
      });
    });
  }
}
