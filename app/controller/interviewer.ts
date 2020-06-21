import { Controller } from 'egg';

export default class InterviewerController extends Controller {
  public async addInterviewer() {
    const { ctx } = this;
    try {
      const { query } = ctx
      const result: any = await ctx.service.interviewer.addInterviewer(query);
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }

  public async interviewerList() {
    const { ctx } = this;
    try {
      const { query } = ctx
      const result: any = await ctx.service.interviewer.List(query);
      ctx.body = {
        success: true,
        data: result
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        success: false,
        msg: error
      }
    }
  }
}