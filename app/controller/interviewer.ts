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

  public async deleteInterviewer() {
    const { ctx } = this;
    try {
      const { query } = ctx
      const result: any = await ctx.service.interviewer.delete(query);
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

  public async excelLoadIn() {
    const { ctx } = this;
    try {
      const node_xlsx = require('node-xlsx');
      const obj = node_xlsx.parse('/Users/yinhang/Desktop/juhaoran.xlsx');// 支持的excel文件类有.xlsx .xls .xlsm .xltx .xltm .xlsb .xlam等
      const excelObj = obj[0].data;//取得第一个excel表的数据
      let insertData: any = [];//存放数据
      // console.log(excelObj)
      //循环遍历表每一行的数据
      for(var i=1;i<excelObj.length;i++){
        var rdata = excelObj[i];
        if(rdata.length > 0){
          var interviewer = {
            name: rdata[1],
            gender: rdata[2],
            affiliatedCompany: rdata[3],
            department: rdata[4],
            jobTitle: rdata[5],
            level: rdata[6],
            workingTerritory: rdata[7],
            trainingDate: rdata[8],
            interviewFrequency: rdata[9],
            interviewNumber: rdata[10]
          }
          insertData.push(interviewer)
        }
      }
      const result: any = await ctx.service.interviewer.addFromExcel(insertData);
      console.log(result)
    } catch (error) {
        console.log(error)
    }
  }
}