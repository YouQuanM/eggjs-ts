// 此model用于存放用户写的文章
import { Document, model, Model, Schema } from 'mongoose';

export interface IArticle {
  // userid
  userId: string;
  // 文章标题
  title: string;
  // 文章内容
  content: string;
  // 类型id
  typeValue: number;
  // 类型名
  typeLable: string;
  // 标签id array
  labelsValue: Array<number>;
  // 标签名 array
  labelsLabel: Array<string>;
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
    typeValue: {
      type: Number
    },
    typeLabel: {
      type: String
    },
    labelsValue: {
      type: Array
    },
    labelsLabel: {
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