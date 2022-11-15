const nodemailer = require('nodemailer');
const envObj = require('./env')

function sendEmail(){
  const mailTransport = nodemailer.createTransport({
    host: envObj.SMTP_CONFIG_IP,
    secure: false,
    port: 25,
});
  
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>會員註冊通知信(一般)</title>
    <style>
      img {
        border: 0px;
        display: block;
      }
      a{
        text-decoration: none;
        color: #000;
      }
      .btn {
        padding: 5px;
        color: #fff;
        font-size: 18px;
        display: block;
        text-align: center;
      }
      table {
        max-width: 1200px;
      }
      .card{
        width: 16rem;
        display: inline-block;
        margin: 1rem 0.5rem;
        background: #fff;
        padding: 10px;
      }
      .card img{
        width: 100%; 
      }
      @media (max-width:620px) {
        .card{
          width: 40%;
        }
      }
    </style>
  </head>
  <body>
    <table align="center">
      <tbody style="text-align: center;">
        <tr>
          <td>
            <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/yesgo_logo.png" alt="" style="display: inline-block;">
          </td>
        </tr>
        <tr>
          <td>
            <h4>聯邦yesgogogo即食購給您的見面禮!</h4>
            <br>
            <p>
              親愛的新會員 您好<br>
              恭喜您成為yesgogogo即食購的新會員!<br>
              新會員好禮折價券$500已發送至您的會員帳戶，<br>
              立即折抵購物吧!
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <a href="#" class="btn" style="background: #F8412E;width: 300px;display: inline-block;margin-bottom: 15px;">立即登入使用</a>
          </td>
        </tr>
        <tr>
          <td style="background: #eee;text-align: center;">
            <a href="#">
              <div class="card">
                <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/zip/P220315000042.jpg" alt="">
                <p>《台灣好粽》蘋果評比常勝軍-傳統北部粽(170g×5入×1盒)(提盒)</p>
                <div style="text-align: center;">
                  <span style="text-decoration: line-through;margin-right:10px">$1250</span><span style="font-size: 24px;">特價$990</span>
                </div>
                <div class="btn" style="background: #f00;margin-top: 10px;">立即搶購</div>
              </div>
            </a>
            <a href="#">
              <div class="card">
                <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/zip/P220315000042.jpg" alt="">
                <p>《台灣好粽》蘋果評比常勝軍-傳統北部粽(170g×5入×1盒)(提盒)</p>
                <div style="text-align: center;">
                  <span style="text-decoration: line-through;margin-right:10px">$1250</span><span style="font-size: 24px;">特價$990</span>
                </div>
                <div class="btn" style="background: #f00;margin-top: 10px;">立即搶購</div>
              </div>
            </a>
            <a href="#">
              <div class="card">
                <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/zip/P220315000042.jpg" alt="">
                <p>《台灣好粽》蘋果評比常勝軍-傳統北部粽(170g×5入×1盒)(提盒)</p>
                <div style="text-align: center;">
                  <span style="text-decoration: line-through;margin-right:10px">$1250</span><span style="font-size: 24px;">特價$990</span>
                </div>
                <div class="btn" style="background: #f00;margin-top: 10px;">立即搶購</div>
              </div>
            </a>
            <a href="#">
              <div class="card">
                <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/zip/P220315000042.jpg" alt="">
                <p>《台灣好粽》蘋果評比常勝軍-傳統北部粽(170g×5入×1盒)(提盒)</p>
                <div style="text-align: center;">
                  <span style="text-decoration: line-through;margin-right:10px">$1250</span><span style="font-size: 24px;">特價$990</span>
                </div>
                <div class="btn" style="background: #f00;margin-top: 10px;">立即搶購</div>
              </div>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  </html>`

  const mailOptions = {
      from: 'test@gmail.com',
      to: 'a45689991@gmail.com',
      subject: 'email 測試信',
      html: html,
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