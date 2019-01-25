import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});
