import { Service } from 'egg';
import Interviewer, { IInterviewer } from '../models/interviewer'



export default class InterviewerService extends Service {
  public async List(query: any) {
    console.log(query)
    if(query.name) {
      const result: IInterviewer[] = await Interviewer.find({name: query.name})
      return result
    }
    const result: IInterviewer[] = await Interviewer.find()
    return result
  }

  public async addInterviewer(interviewer: IInterviewer) {
    console.log(interviewer)
    try {
      // 进行添加
      const saveItem = await new Interviewer(interviewer).save()
      // 返回成功
      return {
        InterviewerId: saveItem._id
      }
    } catch (error) {
      return Error(error)
    }
  }

}