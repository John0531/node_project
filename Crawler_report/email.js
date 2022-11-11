const nodemailer = require('nodemailer');
const moment = require('moment')
const envObj = require('../env')

function sendEmail(){
    const mailTransport = nodemailer.createTransport({
      host: envObj.SMTP_CONFIG_IP,
      secure: false,
      port: 25,
    });
    
    const now = moment().format('YYYYMMDD_HHmm')
    const mailOptions = {
        from: 'yesgogogo@uitc.com.tw',
        to: 'angelashen@uitc.com.tw,cindylin@uitc.com.tw,ipingfu@uitc.com.tw',
        cc: 'shengzhang@uitc.com.tw,donaldwang@uitc.com.tw',
        subject: 'yesgogogo 比價搜尋報表',
        text: 'yesgogogo 比價搜尋報表',
        attachments: [
          {
			      path:`D:/Excel/比價搜尋紀錄_${now}.xlsx`
          }
        ]
    };
       
    mailTransport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;
