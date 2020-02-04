import { Service } from 'egg';
import Article, { IArticle } from '../models/article'

interface AddArticle {
  title: string;
  content?: string;
  labels?: string[];
}

// 搜索参数 页数，关键字，按类别搜索
interface searchQuery {
  pageNum: string;
  keyWord?: string;
  type?: string[];
  // 冗余字段 后面可以加按标签搜索
  labels?: string;
}

export default class ArticleService extends Service {
  /**
   * articleList
   * 文章列表(分页)
   */
  public async articleList(query: searchQuery) {
    let params: any = {}
    // 按关键字搜索
    if (query.keyWord) {
      let reg = new RegExp(query.keyWord, 'i')
      params.title = reg
    }
    // 按类别搜索
    if (query.type) {
      params.type = query.type
    }
    // 按标签搜索
    if (query.labels) {
      params.labels = { $in: query.labels.split(',') }
    }
    const pageNum = parseInt(query.pageNum) - 1
    const result: IArticle[] = await Article.find(params).skip(pageNum*10).limit(10)
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
      const saveItem = await new Article(article).save()
      // 返回成功
      // console.log(saveItem)
      console.log(saveItem._id)
      return {
        articleId: saveItem._id
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * articleDetail
   * 文章详情
   */
  public async articleDetail(id: string) {
    console.log(id)
    try {
      const result = await Article.findById(id)
      return result
    } catch (error) {
      return Error(error)
    }
  }
}