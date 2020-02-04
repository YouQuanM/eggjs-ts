// 此model用于存放用户写的文章
import { Document, model, Model, Schema } from 'mongoose';

export interface IComment {
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

type CommentModel = Document & IComment

const CommentSchema = new Schema (
  {
    articleId: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String
    },
    show: {
      type: Boolean
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


const Comment: Model<CommentModel> = model<CommentModel>('Comment', CommentSchema);
export default Comment;