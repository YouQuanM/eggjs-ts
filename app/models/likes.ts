// 此model用于存放用户点赞和diss的文章id
import { Document, model, Model, Schema } from 'mongoose';

export interface ILikes {
  // userid
  userId: string;
  // 喜欢的articleId arr
  likesArticles: Array<string>;
  // diss的articleid arr
  dissArticles: Array<string>;
}

type LikesModel = Document & ILikes

const LikesSchema = new Schema (
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    likesArticles: {
      type: Array
    },
    dissArticles: {
      type: Array
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


const Likes: Model<LikesModel> = model<LikesModel>('Likes', LikesSchema);
export default Likes;