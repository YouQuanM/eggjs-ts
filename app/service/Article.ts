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
  type?: string[];
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
    .skip(pageNum*10)
    .limit(10)
    let list: any = []
    result.forEach(v => {
      if(v.showAuthor) {
        list.push({
          _id: v.id,
          title: v.title,
          content: v.content,
          typeValue: v.typeValue,
          typeLabel: v.typeLabel,
          labelsLabel: v.labelsLabel,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
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
          _id: v.id,
          title: v.title,
          content: v.content,
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
        const user: IUser | null = await User.findOne({_id: article.userId})
        result.user = {
          name: user?.name,
          avatar: user?.avatar,
          introduction: user?.introduction,
          identity: user?.identity
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
    }
    const update: updateData = {}
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
  // public likeArticle(id) {
    
  // }
}