import { Service } from 'egg';
import User, { IUser } from '../models/user'

interface LogUser {
  name: String,
  password: String,
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
    console.log(user)
    if (user.password.length < 8) {
      return {
        status: 'error',
        msg: '密码必须大于8位'
      }
    }
   
    // const userInfo: any = User.findOne({'name': user.name})
    // if (userInfo === {})
    //   return {
    //     status: 'error',
    //     msg: '该用户名已经被占用'
    //   }
    // }

    // 添加进db
    try {
      const result: IUser = await new User(user).save(function(err) {
          if (err) throw err;
      })
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
    // const userInfo: UserModel | null = await User.findOne({name: user.name})
    const userInfo: any = await User.findOne({name: user.name})
    if (userInfo === null) {
      return {
        success: false,
        msg: '不存在该用户'
      }
    }
    try {
      const result = userInfo.comparePassword(user.password)
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
  public async userInfo() {
    
  }
}
