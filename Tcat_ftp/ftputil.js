const Client = require('ftp');
const fs = require('fs');
const connectMSSQL = require('./sqlutil');
const notice_email = require('../notice_email')

function getData(req, res) {
    const c = new Client();
    const connectionProperties = {
        host: '103.234.81.11',
        port: 21,
        user: 'uitc',
        password: 'u2022i05t09c'
    };
    let i = 0
    function ftpConnect(){
      // ? 切換ftp目標目錄資料夾
      c.cwd('/Receive', function(err){
        if(err&&i<3) {
          console.error(err) 
          i+=1
          setTimeout(() => {
            ftpConnect()
          }, 1000);
          return
        }
        if(i===3){
          notice_email('黑貓 ftp 連線失敗',`正式機掛了 ${err}`)
        }
        if(err){
          return
        }
        // ? 取得目錄資料夾下的所有檔案
        c.list(function(err, list) {
            if (err) throw err;
            // ? 取得所有SOD檔
            let fileList = [];
            list.forEach((item) => {
                if (item.type === '-') {
                    fileList.push(item);
                }
            })
            // get the latest file
            let latestfile = fileList[0];
            fileList.forEach((item) => {
                // ? 轉為毫秒比較時間
                if (Date.parse(item.date) > Date.parse(latestfile.date)) {
                    latestfile = item;
                }
            })

            // ? 指定SOD下載檔名
            if (req&&req.query.filename) {
                const SpecifiedFileName = `${req.query.filename}.SOD`
                latestfile.name = SpecifiedFileName
            }

            // download the latest file
            // ? 下載的特定檔案
            c.get(`${latestfile.name}`, function(err, stream) {
                if (err) throw err;
                console.log('download');
                stream.once('close', function() { c.end(); });
                // ? 創建一個可以寫入的流，並寫入文件到指定檔案
                const writerStream = fs.createWriteStream(`files/${latestfile.name}`);
                stream.pipe(writerStream);
                console.log(`files/${latestfile.name}`);
                stream.on('end', () => {
                    writerStream.end();

                    writerStream.on("finish", function() {
                        console.log("寫入完成。");
                        connectMSSQL(req, res);
                        c.end();
                    });
                })
            });
        });
      });
    }
    c.on('ready', function () {
      ftpConnect()
    });

    c.connect(connectionProperties);
}

module.exports = getData;
