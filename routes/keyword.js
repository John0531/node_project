const sql = require('../dbConnection')

const keyword = {
  searchKeyword:async function(prodId){
    try{
      await sql.dbConnection()
      const result = await sql.query(`select * from PROD_CRAWLER_KEYWORD where varPROD_NO = '${prodId}'`)
      console.log(result.recordset)
      return result.recordset
    }
    catch(err){
      console.log(err)
    }
  },
  saveKeyword:async function(keywordInfo){
    try{
      await sql.dbConnection()
      const result = await sql.query('select varPROD_NO from PROD_CRAWLER_KEYWORD')
      // ? 檢查DB是否已經有關鍵字
      const key = result.recordset.findIndex((item)=>{
        return item.varPROD_NO === keywordInfo.productId
      })
      if(key!==-1){
        // * DB已經有關鍵字，更新DB資料
        await sql.query(`update PROD_CRAWLER_KEYWORD set varKEYWORD = '${keywordInfo.keyword}' WHERE varPROD_NO = '${keywordInfo.productId}'`)
        console.log('update success')
        return true
      } else {
        // * DB沒有關鍵字，寫入新資料
        await sql.query(`INSERT INTO PROD_CRAWLER_KEYWORD VALUES('${keywordInfo.productId}','${keywordInfo.keyword}')`)
        console.log('insert success')
        return true
      }
    }
    catch(err){
      console.log(err)
    }
  }
}

module.exports = keyword