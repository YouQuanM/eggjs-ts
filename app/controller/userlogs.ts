import { Controller } from 'egg';
import { USER_OPERATION } from '../utils/constants'
export default class UserLogsController extends Controller {
  /**
   * getUserLogs
   */
  public async getUserLogs() {
    const { ctx } = this
    const result = await ctx.service.userLogs.getUserLogs(ctx.request.body.userId)
    let userLogs: any = []
    let reg=/<\/?.+?\/?>/g;
    let imgreg = /<img(.*?)>/g;
    result.forEach(v => {
      userLogs.push({
        _id: v._id,
        operator: {
          id: v.operator[0]._id,
          name: v.operator[0].name
        },
        user: {
          id: v.user[0]._id,
          name: v.user[0].name
        },
        article: {
          id: v.article[0]._id,
          title: v.article[0].title
        },
        comment: {
          id: v.comment[0]?._id,
          content: v.comment[0]?.content.replace(imgreg,'[图片]').replace(reg, '').slice(0, 100)
        },
        createdAt: v.createdAt,
        operation: v.operation,
        operationLabel: USER_OPERATION.find(operate => operate.value === v.operation)?.label
      })
    })
    ctx.body = {
      success: true,
      data: userLogs
    }
  }
}
