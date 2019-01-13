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
  mobile: {
    type: Number,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});
