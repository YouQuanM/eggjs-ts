import { Controller } from 'egg';

export default class CommentController extends Controller {
  /**
   * addComment
   * 写评论
   */
  public async addComment() {
    const { ctx, app } = this;
    // todo 去掉any
    const query: any = ctx.request.body
    query.show = true
    // 登录的情况 header里有token
    if (ctx.header.authorization) {
      try {
        // 通过token拿到userid
        query.userId = app.jwt.verify(ctx.header.authorization.split(' ')[1], 'liangzhi')._doc._id
        const result = ctx.service.comment.addComment(query)
        console.log(result)
        ctx.body = {
          success: true,
          msg: '评论成功'
        }
      } catch (error) {
        ctx.status = 400
        ctx.body = {
          success: false,
          msg: error
        }
      }
    } else {
      // 未登录
      try {
        const result = ctx.service.comment.addComment(query)
        console.log(result)
        ctx.body = {
          success: true,
          msg: '评论成功'
        }
      } catch (error) {
        ctx.status = 400
        ctx.body = {
          success: false,
          msg: error
        }
      }
    }
  }

  /**
   * commentList
   */
  public async commentList() {
    const { ctx } = this;
    const id: string = ctx.query.id;
    try {
      const list = await ctx.service.comment.commentList(id)
      ctx.body = {
        success: true,
        data: list,
        msg: '查询成功'
      }
    } catch (error) {
      ctx.status = 400
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }
}
