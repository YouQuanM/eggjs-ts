import { Service } from 'egg';
import Comment, { IComment } from '../models/comment'


interface addComment {
  // 文章id
  articleId: string;
  // userid
  userId: string;
  // userName
  userName: string;
  // 评论内容
  content: string;
  // 假删除字段
  show: boolean;
}

export default class CommentService extends Service {
  /**
   * addComment
   * 添加评论
   */
  public async addComment(comment: addComment) {
    try {
      await new Comment(comment).save()
      return true
    } catch (error) {
      return Error(error)
    }
  }

  /**
   * commentList
   * 评论列表
   */
  public async commentList(id: string) {
    try {
      const list: IComment[] = await Comment.aggregate([
        {
          $match: {articleId: id}
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        }
      ]).sort({_id: -1})
      const result: any[] = []
      // 处理一下查出来的list 把敏感字段去掉
      list.forEach((v:any) => {
        if (v.user.length === 0) {
          result.push({
            _id: v._id,
            articleId: v.articleId,
            content: v.content,
            show: v.show,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt
          })
        } else {
          result.push({
            _id: v._id,
            articleId: v.articleId,
            content: v.content,
            show: v.show,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
            user: {
              _id: v.user[0]._id,
              name: v.user[0].name,
              email: v.user[0].email,
              avatar: v.user[0]?.avatar,
              introduction: v.user[0]?.introduction,
              identity: v.user[0]?.identity
            }
          })
        }
        
      })
      return result
    } catch (error) {
      return Error(error)
    }
  }
}