const getMemberEmail = require('../getMemberEmail')
const sql = require('../../dbConnection')

async function getCouponInfo (){
  try{
    await sql.dbConnection()
    // * 取得所有會員到期折價券
    const result = await sql.query(`select cpi.varMBR_ID,varCOUPON_NAME,ci.intDISCOUNT,ci.varDUE_DATE_ED from COUPON_DEPOSIT_INFO as cpi join MBR_PROFILE as mp on cpi.varMBR_ID=mp.varMBR_ID join COUPON_INFO as ci on cpi.varCOUPON_NO=ci.varCOUPON_NO where mp.varENABLE ='Y' and DATEADD( MONTH,1,GETDATE()) >=ci.varDUE_DATE_ED and GETDATE()<=ci.varDUE_DATE_ED and cpi.dtUSED_DATE is null`)
    console.log(result)
    const couponsInfo = result.recordset
    let set = new Set()
    couponsInfo.forEach((item) => {
      set.add(item.varMBR_ID)
    })
    const members = []
    set.forEach((item)=>{
      members.push(item)
    })
    // * 取得會員 email
    const memberEmails = await getMemberEmail(members)

    memberEmails.forEach((item)=>{
      item.coupons = []
      couponsInfo.forEach((item2)=>{
        if(item.memberId===item2.varMBR_ID){
          item.coupons.push(item2)
        }
      })
    })
    return memberEmails
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = getCouponInfo