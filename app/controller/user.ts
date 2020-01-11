import { Controller } from 'egg';

export default class UserController extends Controller {
  public async getUserList() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.userList;
  }
  /**
   * addUser
   * 注册用户
   */
  public async addUser() {
    const { ctx } = this;
    ctx.body = ctx.service.user.addUser(ctx.query);
  }
  /**
   * login
   * 登录
   */
  public login() {
    const { ctx } = this;
    ctx.body = ctx.service.user.login(ctx.query);
  }
}
