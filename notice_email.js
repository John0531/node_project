const nodemailer = require('nodemailer');
// const moment = require('moment')
const envObj = require('./env')

function sendEmail(Subject,Text){
    const mailTransport = nodemailer.createTransport({
      host: envObj.SMTP_CONFIG_IP,
      secure: false,
      port: 25,
  });
    
    // const yesterday = moment().subtract(1, 'days').format('YYYYMMDD')
    const mailOptions = {
        from: 'yesgogogo@uitc.com.tw',
        to: 'shengzhang@uitc.com.tw,donaldwang@uitc.com.tw',
        subject: Subject,
        text: Text,
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
