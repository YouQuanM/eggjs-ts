import { Controller } from 'egg';

export default class ArticleController extends Controller {
  /**
   * addArticle
   * 新增文章
   */
  public async addArticle() {
    const { ctx } = this;
    const article = ctx.request.body;
    if (article.title) {
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
  public articleList() {
    
  }
}