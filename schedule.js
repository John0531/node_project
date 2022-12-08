const schedule = require('node-schedule');
const ftptest = require('./Tcat_ftp/ftputil');
const Papa_report = require('./Papa_report/processFile');
const fb_writeCSV = require('./fb_writeCSV')
const envObj = require('./env')
const cart_notice = require('./yesgo_email/cart_notice/email')
const coupon_expire = require('./yesgo_email/coupon_expire/email')
const smoney_expire = require('./yesgo_email/smoney_expire/email')
const tracklist_notice = require('./yesgo_email/tracklist_notice/email')
const auto_crawler = require('./Auto_crawler_report/auto_crawler')
const auto_crawler_report = require('./Auto_crawler_report/crawler_report')

// ? 黑貓 ftp 排程
function tcat_ftp(){
	const rule = new schedule.RecurrenceRule();
  rule.hour = [6,19];
  rule.minute = 0;
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'Tcat ftp');
    ftptest()
  });
}

// ? Papawash報表 email 寄送
function papa_report(){
  const rule = new schedule.RecurrenceRule();
  rule.hour = 8;
  rule.minute = 0;
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'papawash report email send');
    Papa_report()
  });
}

// ? fb 產生 CSV 檔
function fb_CSV(){
  const rule = new schedule.RecurrenceRule();
  rule.hour = 16;
  rule.minute = 0;
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'fb CSV create');
    fb_writeCSV()
  });
}

// ?  購物車通知信
function cart_Notice(){
  const rule = new schedule.RecurrenceRule();
  rule.date = 20;
  rule.hour = 10;
  rule.minute = 0;
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'cart_notice email send');
    cart_notice()
  });
}

// ?  追蹤清單通知信
function tracklist_Notice(){
  const rule = new schedule.RecurrenceRule();
  rule.date = 20;
  rule.hour = 10;
  rule.minute = 30;
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'tracklist_notice email send');
    tracklist_notice()
  });
}

// ?  折價券到期通知信
function coupon_Expire(){
  const rule = new schedule.RecurrenceRule();
  rule.date = 10;
  rule.hour = 10;
  rule.minute = 0
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'coupon_expire email send');
    coupon_expire()
  });
}

// ?  購物金到期通知信
function smoney_Expire(){
  const rule = new schedule.RecurrenceRule();
  rule.date = [1,15];
  rule.hour = 10;
  rule.minute = 0
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'smoney_expire email send');
    smoney_expire()
  });
}

// ?  自動比價報表
function auto_Crawler_Report(){
  // ? 自動比價
  schedule.scheduleJob({hour: 3, minute: 0}, function(){
    console.log(new Date(), 'auto_crawler email send');
    auto_crawler()
  });
  // ? 產生比價報表
  schedule.scheduleJob({hour: 9, minute: 0, dayOfWeek: [1,2,3,4,5]}, function(){
    console.log(new Date(), 'auto_crawler_report email send');
    auto_crawler_report()
  });
}

// ? 不同環境執行的排程
if(envObj.ENV === 'dev'){
  tcat_ftp()
  fb_CSV()
} else if (envObj.ENV === 'prod') {
  tcat_ftp()
  papa_report()
  fb_CSV()
  cart_Notice()
  tracklist_Notice()
  auto_Crawler_Report()
}