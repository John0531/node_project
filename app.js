const express = require('express');
const ftptest = require('./Tcat_ftp/ftputil');
const schedule = require('./schedule');
const cors = require('cors');
const crawler = require('./crawler');
const keyword = require('./keyword');
const fb_writeCSV = require('./fb_writeCSV')
const processFile = require('./Papa_report/processFile')
const bp = require('body-parser')

const app = express();
const PORT = 3033;
const corsOptions = {
  origin: [
    'http://localhost:44398',
    'https://localhost:44398',
    'http://test.yesgogogo.com',
    'https://test.yesgogogo.com',
    'http://www.papawash.com.tw',
    'https://www.papawash.com.tw'
  ]
};
app.use(cors(corsOptions));
// body-parser 設定
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json())

app.get('/', (req, res) => {
  res.send('網址請輸入/ftptest?filename')
})

app.get('/api/SearchProductPrice', async(req,res)=> {
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

app.get('/api/SearchKeyword', async(req,res)=> {
  if (req.query.id) {
      const keywordInfo = await keyword.searchKeyword(req.query.id)
      if(keywordInfo.length===0){
        res.status(200).json({message:'查無產品關鍵字', rtncode:404})
        return
      }
      res.status(200).json({info:keywordInfo, rtncode:0})
  }
})

app.post('/api/SaveKeyword', async(req,res)=> {
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

app.get('/ftptest', (req, res) => {
  ftptest(req, res);
})

app.get('/papareporttest', (req,res) => {
  processFile()
})

app.get('/fbcsvtest', (req,res) => {
  fb_writeCSV()
})

app.listen(PORT, () => {
  console.log(`express is running on http://localhost:${PORT}`)
})
