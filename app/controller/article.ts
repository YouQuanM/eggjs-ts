import { Controller } from 'egg';

export default class ArticleController extends Controller {
  /**
   * addArticle
   * 新增文章
   */
  public async addArticle() {
    const { ctx, app } = this;
    const article = ctx.request.body;
    if (article.title) {
      article.userId = app.jwt.verify(ctx.header.authorization.split(' ')[1], 'liangzhi')._doc._id
      const result:any = await ctx.service.article.addArticle(article);
      if (result) {
        ctx.body = {
          success: true,
          msg: '成功',
          data: result
        }
      }
    } else {
      ctx.status = 400
      ctx.body = {
        success: false,
        msg: '标题不能为空'
      }
    }
  }

  /**
   * articleList
   * 全部文章列表
   * 分页
   */
  public async articleList() {
    const { ctx } = this;
    try {
      const result:any = await ctx.service.article.articleList(ctx.query);
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.status = 400
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }

  /**
   * articleDetail
   * 文章详情
   */
  public async articleDetail() {
    const { ctx } = this;
    try {
      const result = await ctx.service.article.articleDetail(ctx.query.id)
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }
}