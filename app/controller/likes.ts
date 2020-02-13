import { Controller } from "egg";

export default class LikesController extends Controller {
  /**
   * updateLikeAndDiss
   * @query {
   *  type: like | diss
   *  articleId: string
   * }
   */
  public async updateLikeAndDiss() {
    const { ctx } = this;
    try {
      const { likesNum } = await ctx.service.likes.updateLikesAndDiss(ctx.request.body)
      ctx.body = {
        success: true,
        msg: '操作成功'
      }
      // 更新article中的likesNumber
      ctx.service.article.likeAndDissArticle(ctx.request.body.articleId, likesNum)
      // 记录
      let operation = 3
      if (ctx.request.body.type === 'like') {
        operation = 3
      }
      if (ctx.request.body.type === 'diss') {
        operation = 4
      }
      const user = await ctx.service.article.getArticleUserId(ctx.request.body.articleId)
      let logquery = {
        operator: ctx.request.body.userId,
        articleId: ctx.request.body.articleId,
        userId: user._id,
        operation: operation // 点赞orDiss
      }
      ctx.service.userLogs.addUserLogs(logquery)
    } catch (error) {
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }
}