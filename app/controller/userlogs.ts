import { Controller } from 'egg';

export default class UserLogsController extends Controller {
  /**
   * getUserLogs
   */
  public async getUserLogs() {
    const { ctx } = this
    const result = await ctx.service.userLogs.getUserLogs(ctx.request.body.userId)
    console.log(result)
  }
}
