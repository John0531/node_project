const nodemailer = require('nodemailer');
const moment = require('moment')
const envObj = require('../env')

function sendEmail(){
    const mailTransport = nodemailer.createTransport({
      host: envObj.SMTP_CONFIG_IP,
      secure: false,
      port: 25,
  });
    
    const yesterday = moment().subtract(1, 'days').format('YYYYMMDD')
    const mailOptions = {
        from: 'papawash@uitc.com.tw',
        to: '500@uitc.com.tw,141@uitc.com.tw',
        cc: 'shengzhang@uitc.com.tw,donaldwang@uitc.com.tw,davidchen@uitc.com.tw',
        subject: 'papawash出貨報表',
        text: 'papawash出貨報表',
        attachments: [
          {
			      path:`D:/Excel/papawash出貨報表_${yesterday}.zip`
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
