const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');

function getFile(file) {
  let insertData = [];
  // read file & 整理資料
  try {
    // get file list
    let filesContent = [];
    const files = fs.readdirSync('files/');
    files.forEach((item) => {
      // ? fs.statSync()獲取文件相關資訊
      statsObj = fs.statSync(`files/${item}`);
      filesContent.push({
        file: item,
        ctime: statsObj.mtime
      })
    })
    
    // get the latest file
    let latestfile = filesContent[0];
    filesContent.forEach((item) => {
      if (Date.parse(item.ctime) > Date.parse(latestfile.ctime)) {
          latestfile = item;
      }
    })
    console.log(latestfile);

    const data = fs.readFileSync(path.resolve(__dirname, `../files/${latestfile.file}`));
    const big5data = iconv.decode(Buffer.from(data), 'big5');
	
    const result = big5data.split('\r\n');
	console.log(result);
    result.forEach((item) => {
      const tempdata = item.split('|');
      let temp = {
        FTPFileName: latestfile.file,
        OBTNumber: tempdata[0],
        OriginOrderNo: tempdata[1],
        StatusID: tempdata[5],
        StatusDescription: tempdata[6],
        GoodsEnterDate: require('moment')().format('YYYY-MM-DD HH:mm:ss'),
        CreateDate: tempdata[3],
      };
      insertData.push(temp);
    })
    insertData.pop();
    let insertStr = (source, start, newStr) => {
      return source.slice(0, start) + newStr + source.slice(start)
    }
    insertData.forEach((item) => {
      item.OriginOrderNo = insertStr(item.OriginOrderNo, 11, '-')
      item.OriginOrderNo = insertStr(item.OriginOrderNo, 25, '-')
      item.OriginOrderNo = insertStr(item.OriginOrderNo, 35, '-')
      item.OrderNo = item.OriginOrderNo.split('-')[0]
      item.ProductNo = item.OriginOrderNo.split('-')[1]
      item.MappingSTDNo = item.OriginOrderNo.split('-')[2]
      item.STDNo = item.OriginOrderNo.split('-')[3]
      item.CreateDate = insertStr(item.CreateDate, 4, '-')
      item.CreateDate = insertStr(item.CreateDate, 7, '-')
      item.CreateDate = insertStr(item.CreateDate, 10, ' ')
      item.CreateDate = insertStr(item.CreateDate, 13, ':')
      item.CreateDate = insertStr(item.CreateDate, 16, ':')
      delete item.OriginOrderNo
    })
    console.log(insertData)
    return insertData;
  } catch (err) {
    console.error(err);
  }
}

module.exports = getFile;
