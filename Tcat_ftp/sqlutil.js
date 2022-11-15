const getFile = require('./getFile');
const sql = require('../dbConnection')

async function connectMSSQL(req, res) {
  // get file content
  const insertData = getFile()
  try{
    await sql.dbConnection()
    insertData.forEach(async(item) => {
      await sql.query(`insert into SODInformation values ('${item.FTPFileName}', '${item.OBTNumber}', '${item.OrderNo}', '${item.ProductNo}', '${item.MappingSTDNo}', '${item.STDNo}', '${item.StatusID}', '${item.StatusDescription}', '${item.GoodsEnterDate}', '${item.CreateDate}')`)
      console.log('insert success!')
    })
    if (req) {
      const result = await sql.query('select * from SODInformation where cast(GoodsEnterDate as date) = cast( getdate() as date )')
      res.json(result);
    }
  }
  catch(err){
    console.error(err)
  }
}

module.exports = connectMSSQL;
