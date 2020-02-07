import { Controller } from 'egg';
const sendToWormhole = require('stream-wormhole');
import * as fs from 'fs';
import * as path from 'path';
import { randomString } from '../utils/index'
const pump = require('mz-modules').pump;
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
   * getUserInfo
   */
  public async getUserInfo() {
    const { ctx, app } = this;
    // 获取用户id
    const userId = app.jwt.verify(ctx.header.authorization.split(' ')[1], 'liangzhi')._doc._id
    try {
      const result: any = await ctx.service.user.getUserInfo(userId)
      ctx.body = {
        success: true,
        userInfo: {
          name: result.name,
          id: result.id,
          avatar: result.avatar || '',
          introduction: result.introduction || ''
        }
      };
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }

  /**
   * modifyUserInfo
   * 修改用户信息
   */
  public async modifyUserInfo() {
    const { ctx } = this;
    // console.log(app.jwt.verify(ctx.header.authorization.split(' ')[1], 'liangzhi'))
    const data = ctx.request.body;
    if (!data.avatar && !data.introduction) {
      ctx.body = {
        success: false,
        msg: '没有修改！'
      }
      return
    }
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

  /**
   * uploadAvatar
   * 上传头像
   */
  public async uploadAvatar() {
    const { ctx } = this;
    const parts: any = await ctx.multipart();
    // ctx.body = stream
    let part: any;
    // parts() 返回 promise 对象
    while ((part = await parts()) != null) {
      if (part.length) {
        // !多个文件 暂时用不到
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          ctx.body = {
            success: false,
            msg: '未上传任何文件'
          }
          return;
        }
        try {
          // 存储到服务端 public文件夹中
          const filename = part.filename.toLowerCase();
          const target = path.join(this.config.baseDir, 'app/public/avatar', randomString(12) + filename);
          const writeStream = fs.createWriteStream(target);
          await pump(part, writeStream);
          // 将该文件路径绑定到该用户头像上
          const data = {
            id: ctx.query.id,
            avatar: target
          }
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
          return
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
      }
    }
  }
}
