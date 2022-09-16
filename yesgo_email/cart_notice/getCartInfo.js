const getMemberEmail = require('../getMemberEmail')
const sql = require('../../dbConnection')

async function getCartInfo(){
  try{
    await sql.dbConnection()
    // * 取得有購物車商品的會員資訊
    const result = await sql.query('select varMBR_ID,varCART_EMAILJSON from CART_JSON where varCART_EMAILJSON is not null')
    const cartInfo = result.recordset
    let members = []
    cartInfo.forEach((item)=>{
      item.products = JSON.parse(item.varCART_EMAILJSON).Items
      delete item.varCART_EMAILJSON
      members.push(item.varMBR_ID)
    })
    // * 取得會員 email
    const memberEmails = await getMemberEmail(members)
    memberEmails.forEach((item)=>{
      cartInfo.forEach((item2)=>{
        if(item.memberId === item2.varMBR_ID){
          item.products = item2.products
        }
      })
    })
    return memberEmails
  }
  catch(err){
    console.log(err)
  }
}

module.exports = getCartInfo