// 此model用于存放用户操作记录
import { Document, model, Model, Schema } from 'mongoose';

export interface IUserLogs {
  // userid
  userId: string;
  // 操作类别
  operation: number;
  // 文章id
  articleId: string;
  // 评论id
  commentId: string;
  // 操作人id
  operatior: string;
}

type UserLogsModel = Document & IUserLogs

const UserLogsSchema = new Schema (
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    operation: {
      type: Number
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    operator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


const UserLogs: Model<UserLogsModel> = model<UserLogsModel>('UserLogs', UserLogsSchema);
export default UserLogs;