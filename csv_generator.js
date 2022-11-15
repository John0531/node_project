const getCartInfo = require('./yesgo_email/cart_notice/getCartInfo')
const fs = require('fs');
const iconv = require('iconv-lite');
const { Parser, transforms: { unwind } } = require('json2csv');
const csvtojson = require('csvtojson')
const Excel = require('exceljs');

async function csv_generate(){
  try{
    const workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('My Sheet')
    worksheet.addTable({
      name: 'table1',  // 表格內看不到的，算是key值，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
      ref: 'A1', // 從A1開始
      columns: [{name:'名字'},{name:'年齡'},{name:'電話'}],
      rows: [['小明','20','0987654321'],['小美','00023','0912345678']],
      headerRow: true
    });
    worksheet.getColumn(3).width = 30
    await workbook.xlsx.writeFile('D:/Excel/Test.xlsx');
    // await workbook.csv.writeFile('D:/Excel/Test.csv',{formatterOptions:{writeBOM:true}});
  }
  catch(err){
    console.error(err)
  }
}
csv_generate()