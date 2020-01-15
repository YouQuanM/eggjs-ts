import { Service } from 'egg';
import User, { IUser } from '../models/user'
import { validEmail } from '../utils/validate'
interface LogUser {
  name: string,
  password: string,
  email: string
}

interface ModifyUser {
  id: string;
  avatar?: string;
  introduction?: string;
}

/**
 * User Service
 */
export default class UserService extends Service {
  /**
   * userList
   */
  public async userList() {
    const result: IUser[] = await User.find({})
    return result
  }
  /**
   * add user
   * 用户注册
   */
  public async addUser(user: LogUser) {
    // 密码需要大于8位
    if (user.password.length < 8) {
      return {
        success: false,
        msg: '密码必须大于8位'
      }
    }

    // 验证email合法性
    if(!validEmail(user.email)) {
      return {
        success: false,
        msg: '邮箱地址不合法'
      }
    }

    // 添加进db
    try {
      const isExist = await User.findOne({name: user.name})
      if (isExist !== null) {
        return {
          success: false,
          msg: '该用户名已经被占用'
        }
      }
      // 进行添加
      await new User(user).save(function(err) {
        if (err) throw err;
      })
      // 返回成功
      return {
        success: true,
        msg: '注册成功'
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * login
   */
  public async login(user: LogUser) {
    // 去user表里找
    // const userInfo: UserModel | null = await User.findOne({name: user.name})
    const userInfo: any = await User.findOne({name: user.name})
    if (userInfo === null) {
      return {
        success: false,
        msg: '不存在该用户'
      }
    }
    try {
      const result = await userInfo.comparePassword(user.password)
      if (result) {
        return {
          success: true,
          data: userInfo
        }
      }
      return {
        success: false,
        msg: '密码错误'
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * userInfo
   */
  public async modifyUserInfo(user: ModifyUser) {
    const update = {
      avatar: user.avatar || null,
      introduction: user.introduction || null
    };
    const opt = { upsert: true, new: true };
    const result: any = await User.findByIdAndUpdate(user.id, update, opt)
    return result
  }
}
