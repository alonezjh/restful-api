import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from "passport";
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { Routes } from './routes/api';

dotenv.config();

class App {

  public app: express.Application;
  public appRoute: Routes = new Routes();
  public mongodbUrl: string = process.env.MONGODB_URL;

  constructor() {
    this.app = express();
    this.config();
    this.appRoute.routes(this.app);
    this.mongodbInit();
  }
  private config = () => {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(session({
      secret: 'alonez',   // 加密字符串
      name: 'alonez',       // 表示cookie的name
      cookie: { maxAge: 60 * 60 * 1000 },   // cookie过期时间，毫秒
      resave: false,      // 是否每次请求都重新设置session cookie
      saveUninitialized: true,    // 是指无论有没有session cookie，每次请求都设置个session cookie
    }));
    this.app.use('/public', express.static('public'));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(passport.initialize());
  }

  private mongodbInit = () => {
    mongoose.set('useCreateIndex', true);
    mongoose
    .connect(this.mongodbUrl, { useNewUrlParser: true })
    .then(() => console.log(`MongoDB connect to ${this.mongodbUrl} `))
    .catch( err => console.log(err));
  }

}

export default new App().app;
