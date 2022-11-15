const getMemberEmail = require('../getMemberEmail')
const sql = require('../../dbConnection')

async function getSmoneyInfo(){
  try{
    await sql.dbConnection()
    // * 取得所有會員到期折價券
    const result = await sql.query(`SELECT  suti.varMBR_ID,sum(suti.intDRAW_ON_AMT) as smoneySum FROM SMONEY_USED_TRACK_INFO as suti join MBR_PROFILE as mp on suti.varMBR_ID= mp.varMBR_ID where mp.varENABLE='Y' group by  suti.varMBR_ID  having sum(intDRAW_ON_AMT)>0`)
    const members = []
    const smoneyInfo = result.recordset
    smoneyInfo.forEach((item)=>{
      members.push(item.varMBR_ID)
    })
    // * 取得會員 email
    const memberEmails = await getMemberEmail(members)
    memberEmails.forEach((item)=>{
      smoneyInfo.forEach((item2)=>{
        if(item.memberId===item2.varMBR_ID){
          item.smoney = item2.smoneySum
        }
      })
    })
    return memberEmails
  }
  catch(err) {
    console.error(err)
  }
}

module.exports = getSmoneyInfo