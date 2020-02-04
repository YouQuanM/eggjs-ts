import { Service } from 'egg';
import Comment, { IComment } from '../models/comment'


interface addComment {
  // 文章id
  articleId: string;
  // userid
  userId: string;
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
      ])

      return list
    } catch (error) {
      return Error(error)
    }
  }
}