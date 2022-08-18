const getFile = require('./getFile');
const envObj = require('../env')

function connectMSSQL(req, res) {
  const sql = require('mssql');

  // get file content
  const insertData = getFile()

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
  sql.connect(config, function (err) {
    if(err) console.log(err);
    const request = new sql.Request()
    // insert data
    insertData.forEach((item) => {
      request.query(`insert into SODInformation values ('${item.FTPFileName}', '${item.OBTNumber}', '${item.OrderNo}', '${item.ProductNo}', '${item.MappingSTDNo}', '${item.STDNo}', '${item.StatusID}', '${item.StatusDescription}', '${item.GoodsEnterDate}', '${item.CreateDate}')`, (err, result)=> {
        if (err) throw err;
        console.log('insert success!');
      });
    })
    // select table 
    if (req) {
      request.query('select * from SODInformation', function(err, recordset){
        if (err) throw err;
        res.send(recordset);
      });
    }
  });
}

module.exports = connectMSSQL;
