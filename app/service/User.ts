import { Service } from 'egg';
import User, { IUser } from '../models/user'
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

    const isExist = await User.findOne({name: user.name})
    if (isExist !== null) {
      return {
        success: false,
        msg: '该用户已经存在'
      }
    }
    // 添加进db
    try {
      // 进行添加
      const result = await new User(user).save()
      return {
        success: true,
        data: result
      }
    } catch (error) {
      return error
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
   * modifyUserInfo
   */
  public async modifyUserInfo(user: ModifyUser) {
    interface updateData {
      avatar?: string,
      introduction?: string
    }
    const update: updateData = {}
    if (user.avatar) {
      update.avatar = user.avatar
    }
    if (user.introduction) {
      update.introduction = user.introduction
    }
    const opt = { upsert: true, new: true };
    const result: any = await User.findByIdAndUpdate(user.id, update, opt)
    return result
  }

  /**
   * getUserInfo
   */
  public async getUserInfo(id: string) {
    try {
      const result: any = await User.findById(id)
      return result
    } catch (error) {
      return Error(error)
    }
  }
}
