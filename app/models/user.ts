import { Document, model, Model, Schema } from 'mongoose';

export interface IUser {
  // id
  id: Number;
  // 用户名
  name: String;
  // 密码
  password: String;
  // 头像
  avatar?: String;
  // 简介
  introduction?: String;
}

const userSchema = new Schema (
  {
    id: {
      type: Number,
      unique: true,
      required: true
    },
    name: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      unique: true
    },
    avatar: {
      type: String
    },
    introduction: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

type UserModel = Document & IUser

const User: Model<UserModel> = model<UserModel>('User', userSchema);
export default User;