import { Controller } from 'egg';

export default class UserController extends Controller {
  /**
   * 用户列表
   */
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
    const result: any = await ctx.service.user.addUser(ctx.query);
    if (result.success) {
      ctx.status = 200
      ctx.body = result
    } else {
      ctx.status = 400
      ctx.body = result
    }
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
        const token = app.jwt.sign({...result.data
        }, app.config.jwt.secret);
        ctx.body = {
          success: true,
          userInfo: {
            name: result.data.name,
            id: result.data.id,
            avatar: result.data.avatar || '',
            introduction: result.data.introduction || ''
          },
          token: token
        };
      } else {
        ctx.status = 400
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
   * modifyUserInfo
   * 修改用户信息
   */
  public async modifyUserInfo() {
    const { ctx } = this;
    const data = ctx.request.body;
    const result: any = await ctx.service.user.modifyUserInfo(data)
    if (result) {
      ctx.status = 200
      ctx.body = {
        success: true,
        userInfo: {
          name: result.name,
          id: result.id,
          avatar: result.avatar || '',
          introduction: result.introduction || ''
        }
      }
    }
  }
}
