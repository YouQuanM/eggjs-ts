import { Service } from 'egg';
import UserLogs from '../models/userlogs'

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
      console.log(id)
      // const query = {
      //   $or: [
      //     { userId: id },
      //     { operator: id }
      //   ]
      // }
      // const result = await UserLogs.find(query)
      const result = await UserLogs.aggregate([
        {
          "$match": {
            "$or": [
              { 'userId': id },
              { 'operator': id }
            ]
          }
        }
        //   // {
        //   //   $lookup: {
        //   //     from: "users",
        //   //     localField: "userId",
        //   //     foreignField: "_id",
        //   //     as: "user"
        //   //   }
        //   // },
        //   // {
        //   //   $lookup: {
        //   //     from: "users",
        //   //     localField: "operator",
        //   //     foreignField: "_id",
        //   //     as: "operator"
        //   //   }
        //   // },
        //   // {
        //   //   $lookup: {
        //   //     from: "article",
        //   //     localField: "articleId",
        //   //     foreignField: "_id",
        //   //     as: "article"
        //   //   }
        //   // },
        //   // {
        //   //   $lookup: {
        //   //     from: "comment",
        //   //     localField: "commentId",
        //   //     foreignField: "_id",
        //   //     as: "comment"
        //   //   }
        //   // }
      ])
      console.log(result)
      return result
    } catch (error) {
      return error
    }
  }
}