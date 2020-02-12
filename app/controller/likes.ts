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
      await ctx.service.likes.updateLikesAndDiss(ctx.request.body)
      ctx.body = {
        success: true,
        msg: '操作成功'
      }
    } catch (error) {
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }
}