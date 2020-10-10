import { Service } from 'egg';
import Interviewer, { IInterviewer } from '../models/interviewer'

export default class InterviewerService extends Service {
  public async List(query: any) {
    console.log(query)
    const {pageNum = 1, pageSize = 10} = query
    if(query.name) {
      const result: IInterviewer[] = await Interviewer.find({name: query.name}).skip((Number(pageNum) - 1) * Number(pageSize)).limit(Number(pageSize))
      const total: Number = await Interviewer.count(Interviewer.find({name: query.name}))
      return {
        result,
        total
      }
    }
    const result: IInterviewer[] = await Interviewer.find().skip((Number(pageNum) - 1) * Number(pageSize)).limit(Number(pageSize))
    const total: Number = await Interviewer.count(Interviewer.find())
    return {
      result,
      total
    }
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

  public async delete(query: any) {
    try {
      // 进行添加
      console.log('query===>', query)
      const result = await Interviewer.deleteOne({_id: query.userId})
      // 返回成功
      return {
        result
      }
    } catch (error) {
      return Error(error)
    }
  }
  
  public async addFromExcel(arr: IInterviewer[]){
    try {
      await Interviewer.remove({})
      const res = await Interviewer.insertMany(arr)
      return res
    } catch (error) {
      return error
    }
  }

  public async editInterviewer(query: any) {
    try {
      console.log(query)
      const result: any = await Interviewer.findByIdAndUpdate(query.id, JSON.parse(query.query))
      return result
    } catch (error) {
      return error
    }
  }

  public async getAllList() {
    const result: IInterviewer[] = await Interviewer.find()
    return result
  }

}