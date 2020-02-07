import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import { randomString } from '../utils/index'
// 这两个没有对应的type包，只能这么引入了
const sendToWormhole = require('stream-wormhole');
const pump = require('mz-modules').pump;

export default class ArticleController extends Controller {
  /**
   * addArticle
   * 新增文章
   */
  public async addArticle() {
    const { ctx, app } = this;
    const article = ctx.request.body;
    if (article.title) {
      article.userId = app.jwt.verify(ctx.header.authorization.split(' ')[1], 'liangzhi')._doc._id
      const result: any = await ctx.service.article.addArticle(article);
      if (result) {
        ctx.body = {
          success: true,
          msg: '成功',
          data: result
        }
      }
    } else {
      ctx.status = 400
      ctx.body = {
        success: false,
        msg: '标题不能为空'
      }
    }
  }

  /**
   * articleList
   * 全部文章列表
   * 分页
   */
  public async articleList() {
    const { ctx } = this;
    try {
      const result: any = await ctx.service.article.articleList(ctx.query);
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.status = 400
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }

  /**
   * articleDetail
   * 文章详情
   */
  public async articleDetail() {
    const { ctx } = this;
    try {
      const result = await ctx.service.article.articleDetail(ctx.query.id)
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }

  /**
   * uploadImg
   * 上传图片
   */
  public async uploadImg() {
    const { ctx } = this;
    const parts: any = await ctx.multipart();
    // ctx.body = stream
    let part: any;
    // parts() 返回 promise 对象
    while ((part = await parts()) != null) {
      if (part.length) {
        // !多个文件 暂时用不到
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          ctx.body = {
            success: false,
            msg: '未上传任何文件'
          }
          return;
        }
        try {
          // 存储到服务端 public文件夹中
          const filename = part.filename.toLowerCase();
          const target = path.join(this.config.baseDir, 'app/public/articleimg', randomString(12) + filename);
          const writeStream = fs.createWriteStream(target);
          await pump(part, writeStream);
          // 返回该文件路径
          ctx.status = 200
          ctx.body = {
            success: true,
            imgUrl: target
          }
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
      }
    }
  }

}