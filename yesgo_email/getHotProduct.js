const sql = require('../dbConnection')

async function getHotProduct(req, res) {
  try{
    await sql.dbConnection()
    const result = await sql.query('SELECT TOP(8) * from PROD_HOTSALE order by intBUYCOUNT desc')
    console.log(result)
    return result.recordset
  }
  catch(err) {
    console.error(err)
  }
}

module.exports = getHotProduct;