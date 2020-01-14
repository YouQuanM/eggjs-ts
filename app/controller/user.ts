import { Controller } from 'egg';
import { debug } from 'util';

export default class UserController extends Controller {
  public async getUserList() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.userList();
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
  public async login() {
    const { ctx, app } = this;
    const data = ctx.request.body;
    // 获取用户信息
    try {
      const result: any = await ctx.service.user.login(data)
      if (result.success) {
        // 生成token
        const token = app.jwt.sign({...result.userInfo
        }, app.config.jwt.secret);
        ctx.body = {
          success: true,
          userInfo: result.userInfo,
          token: token
        };
      } else {
        ctx.body = {
          success: false,
          msg: result.msg
        };
      }
    } catch (error) {
      return error
    }
  }

  /**
   * userInfo
   */
  public async userInfo() {
    const { ctx } = this;
    console.log(ctx.state.user);
    ctx.body
  }
}
