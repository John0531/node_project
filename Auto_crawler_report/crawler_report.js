const Excel = require('exceljs');
const sql = require('../dbConnection')
const moment = require('moment')
const sendEmail = require('./email')

async function crawler_report(){
  try{
    await sql.dbConnection()
    const reportData = await (await sql.query(`SELECT * FROM VW_PROD_CRAWLER_KEYWORD_REPORT`)).recordset
    console.log(reportData)
    const workbook = new Excel.Workbook()
    const worksheet = workbook.addWorksheet('yesgo商品比價報表')
    worksheet.views = [
      {state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A1'}
    ];
    const tableData = []
    reportData.forEach((item)=>{
      tableData.push([item.varPROD_NO,item.varPROD_NAME,item.intSELL_PRICE,item.varKEYWORD,item.varRESULT_PROD_MALL,item.varRESULT_PROD_NAME,item.intRESULT_SELL_PRICE,item.intRepeatTimes])
    })
    console.log(tableData)
    worksheet.addTable({
      name: 'crawler_table',
      ref: 'A1', // 從A1開始
      columns: [{name:'產品編號',filterButton: true},{name:'產品名稱',filterButton: true},{name:'產品售價',filterButton: true},{name:'比價關鍵字',filterButton: true},{name:'比價商城',filterButton: true},{name:'比價產品名稱',filterButton: true},{name:'比價產品售價',filterButton: true},{name:'近5天出現次數',filterButton: true}],
      rows: tableData
    });
    worksheet.getColumn(1).width = 15
    worksheet.getColumn(2).width = 60
    worksheet.getColumn(3).width = 15
    worksheet.getColumn(4).width = 50
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 70
    worksheet.getColumn(7).width = 15
    const colorChange1 = ['A1','B1','C1']
    colorChange1.forEach((item)=>{
      worksheet.getCell(item).fill = {
        type:'pattern',
        pattern: 'solid',
        fgColor: {argb:'FF8FBC8F'},
        bgColor: {argb:'FF8FBC8F'}
      }
    })
    const colorChange2 = ['D1','E1','F1','G1']
    colorChange2.forEach((item)=>{
      worksheet.getCell(item).fill = {
        type:'pattern',
        pattern: 'solid',
        fgColor: {argb:'FF8DB6CD'},
        bgColor: {argb:'FF8DB6CD'}
      }
    })
    worksheet.getCell('H1').fill = {
      type:'pattern',
      pattern: 'solid',
      fgColor: {argb:'FFEEC591'},
      bgColor: {argb:'FFEEC591'}
    }
    const now = moment().format('YYYYMMDD_HHmm')
    await workbook.xlsx.writeFile(`D:/Excel/商品比價報表_${now}.xlsx`);
    console.log('報表產生成功')
    sendEmail()
  }catch(err){
    console.log(err)
  }
}

module.exports = crawler_report