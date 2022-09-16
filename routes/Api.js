const express = require('express')
const router = express.Router()
const crawler = require('./crawler');
const keyword = require('./keyword');

router.get('/SearchProductPrice', async(req,res)=> {
  if (req.query.q) {
      const priceInfo = await crawler.getProductPrice(req.query.q)
      if (priceInfo.length===0){
          res.status(200).json({message:'查無商品資料', rtncode:404})
          return
      }
      const apiReturnData = {info:priceInfo, rtncode:0}
      res.status(200).json(apiReturnData)
  } else {
      res.status(200).json({message:'送出資料有誤', rtncode:415})
  }
})

router.get('/SearchKeyword', async(req,res)=> {
  if (req.query.id) {
      const keywordInfo = await keyword.searchKeyword(req.query.id)
      if(keywordInfo.length===0){
        res.status(200).json({message:'查無產品關鍵字', rtncode:404})
        return
      }
      res.status(200).json({info:keywordInfo, rtncode:0})
  }
})

router.post('/SaveKeyword', async(req,res)=> {
  console.log(req.body)
  if(req.body&&req.body.productId&&req.body.keyword){
    const saveResult = await keyword.saveKeyword(req.body)
    if(saveResult){
      res.status(200).json({message:'已經成功儲存關鍵字', rtncode:0})
    }
  }else{
    res.status(200).json({message:'傳入參數有誤', rtncode:415})
  }
})

module.exports = router