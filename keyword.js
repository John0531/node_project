const sql = require('mssql');
const envObj = require('./env')

const config = {
  user:'app_yesgo',
  password:envObj.DB_CONFIG_PWD,
  server:envObj.DB_CONFIG_SERVER,
  database:'YesgoMarket',
  options: {
      rustedConnection: true,
      encrypt: false,
      enableArithAbort: true,
      trustServerCertificate: true
  }
}

const keyword = {
  searchKeyword:async function(prodId){
    try{
      let pool = await sql.connect(config)
      let result = await pool.request().query(`select * from PROD_CRAWLER_KEYWORD where varPROD_NO = '${prodId}'`)
      console.log(result.recordset)
      return result.recordset
    }
    catch(err){
      console.log(err)
    }
  },
  saveKeyword:async function(keywordInfo){
    try{
      let pool = await sql.connect(config)
      // ? 檢查DB是否已經有關鍵字
      let result = await pool.request().query('select varPROD_NO from PROD_CRAWLER_KEYWORD')
      const key = result.recordset.findIndex((item)=>{
        return item.varPROD_NO === keywordInfo.productId
      })
      if(key!==-1){
        // * DB已經有關鍵字，更新DB資料
        let result2 = await pool.request().query(`update PROD_CRAWLER_KEYWORD set varKEYWORD = '${keywordInfo.keyword}' WHERE varPROD_NO = '${keywordInfo.productId}'`)
        console.log(result2)
        return true
      } else {
        // * DB沒有關鍵字，寫入新資料
        let result3 = await pool.request().query(`INSERT INTO PROD_CRAWLER_KEYWORD VALUES('${keywordInfo.productId}','${keywordInfo.keyword}')`)
        console.log(result3)
        return true
      }
    }
    catch(err){
      console.log(err)
    }
  }
}

module.exports = keyword