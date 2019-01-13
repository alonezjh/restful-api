import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserSchema } from '../models/user';

const User = mongoose.model('User', UserSchema);
const opts = {} as any;

dotenv.config();

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

export class AuthMiddleware {

  public jwtStrategy = new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id, (err, user) => {
      console.log(jwt_payload.id);
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(err => console.log(err));
  });

  public authenticate(passport) {
    passport.use(this.jwtStrategy);
  }
}
