import { Service } from 'egg';
import UserModel, { IUser } from '../models/user'

interface LogUser {
  name: String,
  password: String,
}

// interface Result {
//   success: Boolean,
//   data?: Object,
//   msg?: String
// }

/**
 * User Service
 */
export default class User extends Service {
  /**
   * userList
   */
  public async userList() {
    return []
  }
  /**
   * add user
   * 用户注册
   */
  public async addUser(user: LogUser) {
    console.log(user)
    if (user.password.length < 8) {
      return {
        status: 'error',
        msg: '密码必须大于8位'
      }
    }
   
    // const result: IUser | null = UserModel.findOne({'name': user.name})
    // if (result)
    //   return {
    //     status: 'error',
    //     msg: '该用户名已经被占用'
    //   }
    // }

    // 添加进db
    try {
      const result: IUser = await new UserModel(user).save()
      console.log('save user', result)
      return {
        status: 'success',
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
    const userInfo: any = UserModel.findOne({'name': user.name})
    if (userInfo === {}) {
      return {
        success: false,
        msg: '不存在该用户'
      }
    }
    if (userInfo.password === user.password) {
      return {
        success: true,
        data: userInfo
      }
    }
    return {
      success: false,
      msg: '密码错误'
    }
  }

  /**
   * userInfo
   */
  public async userInfo() {
    
  }
}
