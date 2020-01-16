import { Document, model, Model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;
export interface IUser {
  // 用户名
  name: string;
  // 密码
  password: string;
  // email
  email: string;
  // 头像
  avatar?: string;
  // 简介
  introduction?: string;
}

type UserModel = Document & IUser

const UserSchema = new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },
    email: {
      type: String
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

// save方法的拦截器，将明文密码密码加密保存
UserSchema.pre('save', function (next) {
  var user: any = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
})

// 判断密码是否正确
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const result = await bcrypt.compare(candidatePassword, this.password)
  return result
}

const User: Model<UserModel> = model<UserModel>('User', UserSchema);
export default User;