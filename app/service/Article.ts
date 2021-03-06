import { Service } from 'egg';
import Article, { IArticle } from '../models/article'
import User, { IUser } from '../models/user'

interface AddArticle {
  title: string;
  content?: string;
  labels?: string[];
}

// 搜索参数 页数，关键字，按类别搜索
interface searchQuery {
  pageNum: string;
  keyWord?: string;
  type?: string;
  // 可以加按标签搜索
  labels?: string;
}

// 修改文章参数
interface modifyQuery {
  articleId: string;
  content?: string;
  labelsValue?: Array<number>;
  labelsLabel?: Array<string>;
  showAuthor?: boolean;
  delete?: boolean;
  description: string;
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
      params.typeValue = parseInt(query.type)
    }
    // 按标签搜索
    if (query.labels) {
      params.labelsValue = { $in: query.labels.split(',') }
    }
    const pageNum = parseInt(query.pageNum) - 1
    const result: any[] = await Article.aggregate([
      {
        $match: params
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      }
    ])
    .sort({_id: -1})
    .skip(pageNum*10)
    .limit(10)
    let list: any = []
    result.forEach(v => {
      if(v.showAuthor) {
        list.push({
          id: v._id,
          title: v.title,
          content: v.content,
          typeValue: v.typeValue,
          typeLabel: v.typeLabel,
          labelsLabel: v.labelsLabel,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
          description: v.description,
          user: {
            id: v.user[0]._id,
            name: v.user[0].name,
            avatar: v.user[0]?.avatar,
            introduction: v.user[0]?.introduction,
            identity: v.user[0]?.identity
          }
        })
      } else {
        list.push({
          id: v._id,
          title: v.title,
          content: v.content,
          typeValue: v.typeValue,
          typeLabel: v.typeLabel,
          labelsLabel: v.labelsLabel,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
          description: v.description,
          user: {
            name: '匿名'
          }
        })
      }
    })
    const total = await Article.count(params)
    const pagination = {
      total: total,
      pageSize: 10,
      pageTotal: Math.ceil(total / 10)
    }
    const data = {
      list: list,
      pagination: pagination
    }
    return data
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
      return {
        articleId: saveItem._id
      }
    } catch (error) {
      return Error(error)
    }
  }

  /**
   * articleDetail
   * 文章详情
   */
  public async articleDetail(id: string) {
    try {
      const result: any = {
        article: {},
        user: {}
      }
      const article: IArticle | null = await Article.findOne({_id: id})
      result.article = article
      if (article !== null) {
        if (article?.showAuthor) {
          const user: IUser | null = await User.findOne({_id: article.userId})
          result.user = {
            name: user?.name,
            avatar: user?.avatar,
            introduction: user?.introduction,
            identity: user?.identity
          }
        } else {
          result.article.userId = null
          result.user = {
            name: '匿名'
          }
        }
        return result
      } else {
        return '未找到文章'
      }
    } catch (error) {
      return Error(error)
    }
  }

  /**
   * modifyArticle
   */
  public async modifyArticle(query: modifyQuery) {
    interface updateData {
      content?: string;
      labelsValue?: Array<number>;
      labelsLabel?: Array<string>;
      showAuthor?: boolean;
      delete?: boolean;
      description?: string;
    }
    const update: updateData = {}
    update.description = query.description
    if (query.content) {
      update.content = query.content
    }
    if (query.showAuthor === false || query.showAuthor === true) {
      update.showAuthor = query.showAuthor
    }
    if (query.delete) {
      update.delete = query.delete
    }
    if (query.labelsValue) {
      update.labelsValue = query.labelsValue
    }
    if (query.labelsLabel) {
      update.labelsLabel = query.labelsLabel
    }
    const opt = { upsert: true, new: true };
    const result: any = await Article.findByIdAndUpdate(query.articleId, update, opt)
    return result
  }

  /**
   * likeArticle
   */
  public async likeAndDissArticle(id: string, num: number) {
    const article = await Article.findById(id)
    let likesNum = 0
    if (article?.likes || article?.likes === 0) {
      likesNum = article?.likes + num
    }
    const opt = { upsert: true, new: true };
    const result: any = await Article.findByIdAndUpdate(id, {likes: likesNum}, opt)
    return result
  }

  /**
   * getArticleUserId
   */
  public async getArticleUserId(id: string) {
    try {
      const article = await Article.findOne({_id: id})
      if (article) {
        const user = await User.findOne({_id: article.userId})
        if (user) {
          return user
        }
      }
    } catch (error) {
      return error
    }
  }
}