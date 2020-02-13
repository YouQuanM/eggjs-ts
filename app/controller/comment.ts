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
        query.userName = app.jwt.verify(ctx.header.authorization.split(' ')[1], 'liangzhi')._doc.name
        const result: any = await ctx.service.comment.addComment(query)
        if (result) {
          ctx.body = {
            success: true,
            msg: '评论成功'
          }
          const user = await ctx.service.article.getArticleUserId(ctx.request.body.articleId)
          // 记录
          let logquery = {
            operator: query.userId,
            articleId: ctx.request.body.articleId,
            commentId: result._id,
            userId: user._id,
            operation: 2 // 评论
          }
          ctx.service.userLogs.addUserLogs(logquery)
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
        const result: any = await ctx.service.comment.addComment(query)
        ctx.body = {
          success: true,
          msg: '评论成功'
        }
        const user = await ctx.service.article.getArticleUserId(ctx.request.body.articleId)
        // 记录
        let logquery = {
          operator: null,
          articleId: ctx.request.body.articleId,
          commentId: result._id,
          userId: user._id,
          operation: 2 // 评论
        }
        ctx.service.userLogs.addUserLogs(logquery)
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
