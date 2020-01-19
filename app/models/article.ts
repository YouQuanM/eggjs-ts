// 此model用于存放用户写的文章
import { Document, model, Model, Schema } from 'mongoose';

interface IArticle {
  // userid
  userId: string;
  // 文章标题
  title: string;
  // 文章内容
  content: string;
  // 标签
  labels: Array<string>;
}

type ArticleModel = Document & IArticle

const ArticleSchema = new Schema (
  {
    userId: {
      type: String
    },
    title: {
      type: String
    },
    content: {
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


const Article: Model<ArticleModel> = model<ArticleModel>('User', ArticleSchema);
export default Article;