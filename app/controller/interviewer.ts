import { Controller } from 'egg';
import { fs } from 'mz';

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
      for (var i = 1; i < excelObj.length; i++) {
        var rdata = excelObj[i];
        if (rdata.length > 0) {
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
            interviewNumber: rdata[10],
            passNumber: rdata[11]
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

  public async editInterviewer() {
    const { ctx } = this;
    try {
      const { query } = ctx
      const result: any = await ctx.service.interviewer.editInterviewer(query);
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

  public async downloadExcel() {
    const { ctx } = this
    try {
      var nodeExcel = require('excel-export')
      const result = await ctx.service.interviewer.getAllList();
      var conf: any = {};//创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
      conf.name = '面试官信息'
      // var cols = ['姓名', '性别', '所属公司', '部门', '职务', '面试官级别', '工作属地', '培训/复训日期', '面试场次', '面试人数', '通过人数'];
      conf.cols = [{
        caption:'姓名',
            type:'string',
      },{
        caption:'性别',
        type:'string',
      },{
        caption:'所属公司',
        type:'string'
      },{
        caption:'部门',
        type:'string'
      },{
        caption:'职务',
        type:'string'
      },{
        caption:'面试官级别',
        type:'string'
      },{
        caption:'工作属地',
        type:'string'
      },{
        caption:'培训/复训日期',
        type:'string'
      },{
        caption:'面试场次',
        type:'string'
      },{
        caption:'面试人数',
        type:'string'
      },{
        caption:'通过人数',
        type:'string'
      }]
      const tows = ['name', 'gender', 'affiliatedCompany', 'department', 'jobTitle', 'level', 'workingTerritory', 'trainingDate', 'interviewFrequency', 'interviewNumber', 'passNumber']
      let datas: any = [];//用于承载数据库中的数据
      let towsLen = tows.length
      let dataLen = result.length
      for (var i = 0; i < dataLen; i++) {//循环数据库得到的数据，因为取出的数据格式为
        let row: any = [];//用来装载每次得到的数据
        for (let j = 0; j < towsLen; j++) {//内循环取出每个
          row.push(result[i][tows[j]].toString());
        }
        datas.push(row);//将每一个{ }中的数据添加到承载中
      }
      conf.rows = datas;//将所有行加入rows中
      var excel = nodeExcel.execute(conf);//将所有数据写入nodeExcel中
      const fileName = 'test.xlsx';
      ctx.response.attachment(fileName);
      ctx.status = 200;
      ctx.body = fs.createReadStream(excel);
    } catch (error) {

    }
  }
}