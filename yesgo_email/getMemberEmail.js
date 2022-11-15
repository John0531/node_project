const axios = require('axios');
const https = require('https')
const envObj = require('../env')

async function getMemberEmail(members){
  try {
    const res = await axios({
      method: 'post',
      url: `${envObj.EMALL_API_URL}/api/members/GetMemberInfo`,
      data: members,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    return res.data.info
  }
  catch(err){
    console.error(err)
  }
}

module.exports = getMemberEmail