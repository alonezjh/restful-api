import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from "passport";
import * as dotenv from 'dotenv';
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
