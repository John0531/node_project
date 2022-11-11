const rp = require('request-promise');
const cheerio = require('cheerio');
const sql = require('../dbConnection')

const crawler = {
    getProductPrice:async function(searchInfo){
				crawler.recordCrawlerInfo(searchInfo) // ? 紀錄比價資訊
        const encodedStr = encodeURI(searchInfo.keyword)
        const options = {
            method: 'GET',
            url: `https://biggo.com.tw/s/?q=${encodedStr}`,
            transform: function (body) {
                return cheerio.load(body);
            }
        }
        try {
            const $ = await rp(options)
            // console.log($('.list-desc'))
            const List = $('.list-desc').map((index,obj) => {
                return {
                    name: $(obj).find('.list-product-name a').text().trim(),
                    price: $(obj).find('.price').text().trim(),
                    mall: $(obj).find('.store span').text().trim(),
                    href: $(obj).find('.gaobj').attr('href').trim()
                }
            }).get()
            // console.log(List)
            const returnData = List.filter((item) => {
                return item.mall !== ''&&!item.price.includes('~')
            })
            returnData.forEach(item => {
                item.price = item.price.replace(',','')
                item.price = item.price.replace('$','')
                item.price = parseInt(item.price)
                item.href = `https://biggo.com.tw/${item.href}`
            })
            // console.log(returnData)
            return returnData
        }
        catch(err){
            console.log(err)
        }
    },
		// ? 將比價紀錄存進DB
    recordCrawlerInfo: async function(searchInfo) {
			try{
				await sql.dbConnection()
				await sql.query(`insert into PROD_CRAWLER_KEYWORD_LOG (varUSER_ID,varPROD_NO,varKEYWORD) values ('${searchInfo.userId}','${searchInfo.productId}','${searchInfo.keyword}')`)
				console.log('成功紀錄比價資訊')
			}catch(err){
				console.log(err)
			}
    }
}

module.exports = crawler