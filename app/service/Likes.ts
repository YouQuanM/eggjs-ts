import { Service } from 'egg';
import Likes from '../models/likes'
// { ILikes }

interface updateQuery {
  type: string;
  articleId: string;
  userId: string;
}

export default class LikesService extends Service {
  /**
   * initializationLikes
   * 初始化点赞
   */
  public async initializationLikes(userId: string) {
    try {
      const result = await new Likes({ userId: userId, likesArticles: [], dissArticles: [] }).save()
      return result
    } catch (error) {
      return error
    }
  }

  /**
   * addLikesAndDiss
   * 点赞或Diss
   */
  public async updateLikesAndDiss(query: updateQuery) {
    const userlikesDissData = await Likes.findOne({ userId: query.userId })
    const { type, articleId } = query;
    let updata: any = {}
    let dissArr = userlikesDissData?.dissArticles
    let likesArr = userlikesDissData?.likesArticles
    let likesNum = 0
    switch (type) {
      // 如果是点赞
      case 'like':
        // 去查diss字段里含不含这个id
        if (dissArr?.includes(articleId)) {
          updata.dissArticles = findAndRemove(dissArr, articleId)
          likesNum = 2
        } else {
          likesNum = 1
        }
        if (likesArr && likesArr.length > 0) {
          updata.likesArticles = [...likesArr, articleId]
        } else {
          updata.likesArticles = [articleId]
        }
        break
      // 如果是diss
      case 'diss':
        // 去查like字段里含不含这个id
        if (likesArr?.includes(articleId)) {
          updata.likesArticles = findAndRemove(likesArr, articleId)
          likesNum = -2
        } else {
          likesNum = -1
        }
        if (dissArr && dissArr.length > 0) {
          updata.dissArticles = [...dissArr, articleId]
        } else {
          updata.dissArticles = [articleId]
        }
        break
      // 如果是取消点赞
      case 'unlike':
        if (likesArr?.includes(articleId)) {
          updata.likesArticles = findAndRemove(likesArr, articleId)
          likesNum = -1
        }
        break
      // 如果是取消diss
      case 'undiss':
        if (dissArr?.includes(articleId)) {
          updata.dissArticles = findAndRemove(dissArr, articleId)
          likesNum = 1
        }
        break
    }
    try {
      const result = await Likes.findByIdAndUpdate(userlikesDissData?._id, updata, { upsert: true, new: true })
      return {
        result: result,
        likesNum: likesNum
      }
    } catch (error) {
      return error
    }
  }

  /**
   * getLikeAndDiss
   */
  public async getLikeAndDiss(userId: string) {
    try {
      const userlikesDissData = await Likes.findOne({ userId: userId })
      return userlikesDissData
    } catch (error) {
      return error
    }
  }
}

function findAndRemove(arr: Array<string>, id: string) {
  const i = arr.indexOf(id)
  arr.splice(i, 1)
  return arr
}