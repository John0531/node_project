const Excel = require('exceljs');
const sql = require('../dbConnection')
const moment = require('moment')
const sendEmail = require('./email')

// ? 取得爬蟲記錄報表
async function crawler_record(){
  try{
    await sql.dbConnection()
    const result = await sql.query(`SELECT varUSER_ID,varPROD_NO,varKEYWORD,convert(varchar,dtCreateDate,120) as dtCreateDate from PROD_CRAWLER_KEYWORD_LOG where dtCreateDate >= dateadd(HOUR,-1,getdate()) order by varUSER_ID,dtCreateDate`)
    const recordData = result.recordset
    console.log(recordData)
    const workbook = new Excel.Workbook()
    const worksheet = workbook.addWorksheet('比價搜尋紀錄')
    if(recordData.length!==0){
      const tableData = []
      recordData.forEach((item)=>{
        tableData.push([item.varUSER_ID,item.varPROD_NO,item.varKEYWORD,item.dtCreateDate])
      })
      console.log(tableData)
      worksheet.addTable({
        name: 'crawler_table',  // 表格內看不到的，算是key值，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
        ref: 'A1', // 從A1開始
        columns: [{name:'使用者ID'},{name:'產品ID'},{name:'搜尋關鍵字'},{name:'搜尋時間'}],
        rows: tableData
      });
      // worksheet.autoFilter = 'A1:D1'
      worksheet.getColumn(1).width = 15
      worksheet.getColumn(2).width = 20
      worksheet.getColumn(3).width = 90
      worksheet.getColumn(4).width = 30
    } else {
      worksheet.getCell('A1').value = '查無比價資訊'
      worksheet.getColumn(1).width = 60
      worksheet.getCell('A1').font = {
        size: 28,
        color: {argb: 'FFFF0000'}
      }
    }
    const now = moment().format('YYYYMMDD_HHmm')
    await workbook.xlsx.writeFile(`D:/Excel/比價搜尋紀錄_${now}.xlsx`);
    console.log('報表產生成功')
    sendEmail()
  }catch(err){
    console.error(err)
  }
}

module.exports = crawler_record