const fs = require('fs');
const moment = require('moment');
const email = require('./email');
const archiver = require('archiver');
archiver.registerFormat('zip-encrypted', require('archiver-zip-encrypted'))

function processFile(){
    // ? 取得時間字串
    const yesterday = moment().subtract(1, 'days').format('YYYYMMDD')
    // ? 建立寫入流
    const output = fs.createWriteStream(`D:/Excel/papawash出貨報表_${yesterday}.zip`)
    // ? 壓縮設定
    const archive = archiver.create('zip-encrypted',{
        zlib:{
            level:8
        },
        encryptionMethod:'aes256',
        password:`papa${yesterday}` // ? 壓縮檔密碼
    })
    // ? 對文件壓縮
    archive.file(`D:/Excel/出貨通知單_${yesterday}.xlsx`,{name:`出貨通知單_${yesterday}.xlsx`})
    archive.file(`D:/Excel/郵寄快遞系統_${yesterday}.xlsx`,{name:`郵寄快遞系統_${yesterday}.xlsx`})
    archive.file(`D:/Excel/HCTStandardV2_${yesterday}.xlsx`,{name:`HCTStandardV2_${yesterday}.xlsx`})
    // ? 將打包對象與寫入流關聯
    archive.pipe(output)
    // ? 監聽所有 archive 數據都寫完
    output.on('close',function(){
        console.log('壓縮完成')
        email() // * 壓縮並設定密碼完成後寄出 email
    })
    output.on('error',function(err){
        console.log('壓縮失敗')
        throw err
    })
    // ? 打包
    archive.finalize()
}

module.exports = processFile