import { Service } from 'egg';
import Article, { IArticle } from '../models/article'

interface AddArticle {
  title: string;
  content?: string;
  label?: string[];
}

export default class ArticleService extends Service {
  /**
   * articleList
   * 文章列表(分页)
   * todo 分页
   */
  public async articleList() {
    const result: IArticle[] = await Article.find({})
    return result
  }

  /**
   * addArticle
   * 写文章
   */
  public async addArticle(article: AddArticle) {
    console.log(article)
    try {
      // 进行添加
      await new Article(article).save(function(err) {
        if (err) throw err;
      })
      // 返回成功
    } catch (error) {
      
    }

  }
}