// 此model用于存放用户写的文章
import { Document, model, Model, Schema } from 'mongoose';

export interface IArticle {
  // userid
  userId: string;
  // 文章标题
  title: string;
  // 文章内容
  content: string;
  // 类型
  type: string;
  // 标签
  labels: Array<string>;
}

type ArticleModel = Document & IArticle

const ArticleSchema = new Schema (
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    type: {
      type: String
    },
    labels: {
      type: Array
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


const Article: Model<ArticleModel> = model<ArticleModel>('Article', ArticleSchema);
export default Article;