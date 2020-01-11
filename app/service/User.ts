import { Service } from 'egg';
import UserModel, { IUser } from '../models/user'


/**
 * User Service
 */
export default class User extends Service {
  public userList: IUser[] = []

  /**
   * add user
   * 用户注册
   */
  public async addUser(user: IUser) {
    if (user.password.length < 8) {
      return {
        status: 'error',
        msg: '密码必须大于8位'
      }
    }
    if (this.userList.map(x => x.name).includes(user.name)) { 
      return {
        status: 'error',
        msg: '该用户名已经被占用'
      }
    }

    this.userList.push(user)
    UserModel.
    console.log(this.userList)
    return {
      status: 'success',
      msg: '注册成功'
    }
  }

  /**
   * login
   */
  public async login(user: IUser) {
    // todo 去user表里找
    console.log(user)
  }
}
