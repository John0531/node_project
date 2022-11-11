const sql = require('../dbConnection')
const crawler = require('../routes/crawler')

// ? 自動比價找出價格更低的商品
async function auto_crawler(){
  try{
    await sql.dbConnection()
    const crawlerProducts = await (await sql.query(`SELECT * FROM VW_PROD_CRAWLER_KEYWORD_LIST`)).recordset
    console.log(crawlerProducts)
    for(let i=0;i<crawlerProducts.length;i++){
      console.log(`${i+1}/${crawlerProducts.length}`)
      let compareResult = await crawler.getProductPrice({keyword:crawlerProducts[i].varKEY_WORDS})
      compareResult = compareResult.filter((item)=>{
        return item.price<crawlerProducts[i].intSELL_PRICE
      })
      console.log(`Result Product Number: ${compareResult.length}`)
      for(let j=0;j<compareResult.length;j++){
        await sql.query(`INSERT INTO PROD_CRAWLER_KEYWORD_RESULT (varPROD_NO,varPROD_NAME,varKEYWORD,intSELL_PRICE,varRESULT_PROD_MALL,varRESULT_PROD_NAME,intRESULT_SELL_PRICE)
      VALUES ('${crawlerProducts[i].varPROD_NO}','${crawlerProducts[i].varPROD_NAME}','${crawlerProducts[i].varKEY_WORDS}',${crawlerProducts[i].intSELL_PRICE},'${compareResult[j].mall}','${compareResult[j].name}',${compareResult[j].price})`)
        console.log('insert success')
      }
    }
    console.log('比價結果寫入完成')
  }catch(err){
    console.log(err)
  }
}

module.exports = auto_crawler