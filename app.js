const express = require('express');
const router = require('./routes/Api')
const ftptest = require('./Tcat_ftp/ftputil');
const schedule = require('./schedule');
const cors = require('cors');
const fb_writeCSV = require('./fb_writeCSV')
const processFile = require('./Papa_report/processFile')
const bp = require('body-parser')
const email_test = require('./yesgo_email/tracklist_notice/email')

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

app.use('/api',router)

app.get('/', (req, res) => {
  res.send('網址請輸入/ftptest?filename')
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

app.get('/emailtest', (req,res) => {
  email_test()
})

app.listen(PORT, () => {
  console.log(`express is running on http://localhost:${PORT}`)
})
