import { Document, model, Model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;
export interface IUser {
  // 用户名
  name: String;
  // 密码
  password: String;
  // 头像
  avatar?: String;
  // 简介
  introduction?: String;
}

type UserModel = Document & IUser

const UserSchema = new Schema (
  {
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

UserSchema.pre('save', function(next) {
  var user: any = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
})

UserSchema.methods.comparePassword = function(candidatePassword: String) {
  const result = bcrypt.compare(candidatePassword, this.password)
  console.log(result)
  return result
  // function(err, isMatch) {
  //     if (err) return false;
  //     return isMatch
  // })
}

const User: Model<UserModel> = model<UserModel>('User', UserSchema);
export default User;