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
        to: 'shengzhang@uitc.com.tw,donaldwang@uitc.com.tw',
        // cc: 'shengzhang@uitc.com.tw,donaldwang@uitc.com.tw',
        subject: 'yesgogogo 商品比價報表',
        text: 'yesgogogo 商品比價報表',
        attachments: [
          {
			      path:`D:/Excel/商品比價報表_${now}.xlsx`
          }
        ]
    };
       
    mailTransport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;
