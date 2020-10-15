import { Controller } from 'egg';
// import { fs } from 'mz';
const moment = require('moment');
const Excel = require('exceljs')

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
            trainingDate: moment(rdata[8], 'YYYYMMDD').valueOf(),
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
    const { ctx } = this;
    const workbook = new Excel.Workbook()
    workbook.creator = 'juhaoran'
    workbook.lastModifiedBy = 'juhaoran'
    workbook.created = new Date()
    workbook.modified = new Date()
    let sheet = workbook.addWorksheet('面试官表格')

    sheet.columns = [
      { header: '姓名', key: 'name' },
      { header: '性别', key: 'gender' }, {
        header: '所属公司',
        key: 'affiliatedCompany'
      }, {
        header: '部门',
        key: 'department'
      }, {
        header: '职务',
        key: 'jobTitle'
      }, {
        header: '面试官级别',
        key: 'level'
      }, {
        header: '工作属地',
        key: 'workingTerritory'
      }, {
        header: '培训/复训日期',
        key: 'trainingDate'
      }, {
        header: '面试场次',
        key: 'interviewFrequency'
      }, {
        header: '面试人数',
        key: 'interviewNumber'
      }, {
        header: '通过人数',
        key: 'passNumber'
      }
    ]
    try {

      const result = await ctx.service.interviewer.getAllList();
      console.log(result);
      
      result.forEach(item => {
        item.trainingDate = moment(new Date(Number(item.trainingDate))).format('YYYYMMDD')
      })
      sheet.addRows(result)

      //我们要下载excel文件，可以这样设置
      ctx.attachment('面试官表格.xlsx')
      ctx.type = '.xlsx'
      this.ctx.set('Content-Type', 'application/octet-stream')
      //设置响应 Content-Type 通过 mime 字符串或文件扩展名。如：ctx.type = 'text/plain; charset=utf-8'; 或者 ctx.type = '.png';
      ctx.body = await workbook.xlsx.writeBuffer() // 这个是exceljs的方法
    } catch (error) {

    }
    

  }
}