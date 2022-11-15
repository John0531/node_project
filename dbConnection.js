const envObj = require('./env')
const sql = require('mssql')

sql.dbConnection = async function(){
  try{
    // ! DB連線
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
    await sql.connect(config)
    console.log('db is connected')
  }
  catch(err){
    console.error('db connect error', err)
  }
}
module.exports = sql