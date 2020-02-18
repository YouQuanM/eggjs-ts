import { Service } from 'egg';
import UserLogs from '../models/userlogs'
import { Types } from 'mongoose'

interface userLogsQuery {
  operator: string | null;
  articleId: string;
  operation: number;
  commentId?: string;
  userId?: string;
}

export default class UserLogsService extends Service {
  /**
   * addUserLogs
   * 添加用户记录
   */
  public async addUserLogs(query: userLogsQuery) {
    try {
      const result = await new UserLogs(query).save()
      return result
    } catch (error) {
      return error
    }
  }

  /**
   * getUserLogs
   */
  public async getUserLogs(id: string) {
    try {
      let params = {
        $or: [
          {userId: Types.ObjectId(id)},
          {operator: Types.ObjectId(id)}
        ]
      }
      const result = await UserLogs.aggregate([
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
        },
        {
          $lookup: {
            from: "users",
            localField: "operator",
            foreignField: "_id",
            as: "operator"
          }
        },
        {
          $lookup: {
            from: "articles",
            localField: "articleId",
            foreignField: "_id",
            as: "article"
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "commentId",
            foreignField: "_id",
            as: "comment"
          }
        }
      ])
      return result
    } catch (error) {
      return error
    }
  }
}