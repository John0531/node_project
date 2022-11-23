const rp = require('request-promise');
const cheerio = require('cheerio');
const sql = require('../dbConnection')

const crawler = {
    getProductPrice:async function(searchInfo){
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
            console.error(err)
        }
    }
}

module.exports = crawler