const getMemberEmail = require('../getMemberEmail')
const sql = require('../../dbConnection')

async function getTracklistInfo(){
  try{
    await sql.dbConnection()
    // * 取得有追蹤清單商品的會員資訊
    const result = await sql.query(`select varMBR_Id,p.varProd_No,p.varPROD_NAME,intLIST_PRICE,case when (intPROMO_PRICE<>0 and varPROMO_TIME_ST<=FORMAT(GETDATE(), 'yyyyMMddHHmm') and varPROMO_TIME_ED>=FORMAT(GETDATE(), 'yyyyMMddHHmm')) THEN intPROMO_PRICE ELSE ps.intSELL_PRICE END sellprice from WishList as w inner join PRODUCT_INFO as p on w.varProd_No = p.varPROD_NO and p.varSTATUS in (4,5) and (p.dtONSHELF_DATE <= GETDATE() and (p.dtOFFSHELF_DATE is null OR p.dtOFFSHELF_DATE >= GETDATE())) inner join PROD_STD_INFO as ps on ps.varPROD_NO = p.varPROD_NO and ps.varSTD_NO = w.varOpt_Id`)
    const tracklistInfo = result.recordset
    console.log(tracklistInfo)
    let set = new Set()
    tracklistInfo.forEach((item)=>{
      set.add(item.varMBR_Id)
    })
    const members = []
    set.forEach((item)=>{
      members.push(item)
    })
    console.log(members)
    // * 取得會員 email
    const memberEmails = await getMemberEmail(members)
    memberEmails.forEach((item)=>{
      item.tracklist = []
      tracklistInfo.forEach((item2)=>{
        if(item.memberId===item2.varMBR_Id){
          item.tracklist.push(item2)
        }
      })
    })
    return memberEmails
  }
  catch(err){
    console.log(err)
  }
}

module.exports = getTracklistInfo