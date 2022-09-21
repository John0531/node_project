const schedule = require('node-schedule');
const ftptest = require('./Tcat_ftp/ftputil');
const Papa_report = require('./Papa_report/processFile');
const fb_writeCSV = require('./fb_writeCSV')
const envObj = require('./env')

// ? 黑貓 ftp 排程
function job1(){
	const rule = new schedule.RecurrenceRule();
  rule.hour = [6,19];
  rule.minute = 0;
  schedule.scheduleJob(rule, function(){
    console.log(new Date(), 'Tcat ftp');
    ftptest()
  });
}

// ? email 寄送
function job2(){
  const rule2 = new schedule.RecurrenceRule();
  rule2.hour = 8;
  rule2.minute = 0;
  schedule.scheduleJob(rule2, function(){
    console.log(new Date(), 'email send');
    Papa_report()
  });
}

// ? fb 產生 CSV 檔
function job3(){
  const rule3 = new schedule.RecurrenceRule();
  rule3.hour = 16;
  rule3.minute = 0;
  schedule.scheduleJob(rule3, function(){
    console.log(new Date(), 'fb CSV create');
    fb_writeCSV()
  });
}

// ? 不同環境執行的排程
if(envObj.ENV === 'dev'){
  job1()
  job3()
} else if (envObj.ENV === 'prod') {
  job1()
  job2()
  job3()
}