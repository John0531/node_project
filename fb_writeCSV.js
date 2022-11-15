const fs = require('fs');
const { stringify } = require('csv-stringify')
const sql = require('./dbConnection')

async function writeCSV(){
    try{
        await sql.dbConnection()
        const result = await sql.query(`SELECT pi.varPROD_NO as id,pi.varPROD_NAME as title ,TRIM(pi.varPROD_NAME) as description, ('in stock') as availability,('new') as condition,(  select top 1 case when format(getdate(),'yyyyMMddHHmmss') > varPROMO_TIME_ST and format(getdate(),'yyyyMMddHHmmss')< varPROMO_TIME_ED THEN intPROMO_PRICE ELSE intSELL_PRICE END price from PROD_STD_INFO where varPROD_NO=pi.varPROD_NO order by varSTD_NO) as price ,('https://www.yesgogogo.com/productboard/product/'+pi.varPROD_NO) as link ,('https://yesgoimages.s3.ap-northeast-1.amazonaws.com/zip/'+pi.varPROD_NO+'.jpg') as image_link ,'Taiwan' as brand FROM PRODUCT_INFO as pi where varSTATUS in (4,5) and dtONSHELF_DATE < GETDATE() and not exists (select varSTORE_LV1 from PROD_CLASSIFY_INFO where varPROD_NO=pi.varPROD_NO and varSTORE_LV1<>'S07')`)
        const sqlData = result.recordset
        const tableData = []
        const title = ['id','title','description','availability','condition','price','link','image_link','brand']
        tableData.push(title)
        sqlData.forEach((item) => {
            tableData.push([item.id,item.title,item.description,item.availability,item.condition,item.price,item.link,item.image_link,item.brand])
        })
        stringify(tableData,{bom: true}).pipe(fs.createWriteStream('D:/Excel/YesGo.csv'))
        console.log('write successful')
    }
    catch(err){
        console.error(err)
    }
}

module.exports = writeCSV