const nodemailer = require('nodemailer');
const envObj = require('../../env')
const getTracklistInfo = require('./getTracklistInfo')

async function sendEmail(){
  const mailTransport = nodemailer.createTransport({
    host: envObj.SMTP_CONFIG_IP,
    secure: false,
    port: 25,
  });
  try{
    // * 取得會員追蹤清單資訊
    const tracklistInfo = await getTracklistInfo()
    console.log(tracklistInfo)
    tracklistInfo.forEach((members) => {
      let trackStr = ''
      members.tracklist.forEach((product)=>{
        trackStr += `<tr>
        <td class="card-img">
          <a href="https://www.yesgogogo.com/productboard/product/${product.varProd_No}">
            <img style="width: 100%;padding:10px;" src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/Original/${product.varProd_No}.jpg" alt="">
          </a>
        </td>
        <td class="card-text">
          <a style="color:#000" href="https://www.yesgogogo.com/productboard/product/${product.varProd_No}">
            <div class="card-name">${product.varPROD_NAME}</div>
            <div class="price-content">
              <span class="old-price">$${product.intLIST_PRICE}</span>
              <span class="price-cut" style="color:#F8412E;">特價$<span class="price">${product.sellprice}</span></span>
            </div>
          </a>
        </td>
      </tr>`
      })
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>追蹤清單商品提醒信</title>
        <style>
          *, *:after, *:before{
            box-sizing: border-box;
          }
          img {
            border: 0px;
          }
          a{
            text-decoration: none;
            color: #000;
          }
          p{
            font-size: 20px;
            margin:0 0 5px 0;
          }
          .btn {
            padding: 5px;
            color: #fff;
            font-size: 18px;
            display: block;
            text-align: center;
            background: #F8412E;
          }
          .email-title{
            padding: 20px 0;
          }
          .login-btn{
            display: inline-block;
            width: 400px;
            padding: 5px 0;
            font-size: 24px;
          }
          table {
            max-width: 1200px;
          }
          .card-img{
            width: 30%;
          }
          .card-text{
            width: 70%;
            vertical-align: top;
            padding: 10px 0 10px 20px;
          }
          .price-content{
            white-space: nowrap;
            margin-top: 10%;
          }
          .old-price{
            text-decoration: line-through;
            margin-right: 10px;
            font-size: 24px;
          }
          .price-cut{
            font-size: 24px;
          }
          .price{
            font-size: 48px;
          }
          .card-name{
            font-size: 24px;
            font-weight: 500;
            height: 4rem;
            overflow: hidden;
          }
          #card-content{
            text-align: left;
            background: #fb9388 url(https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/bg.gif);
            background-position: bottom center;
            background-repeat: no-repeat;
            background-size:100% auto;
            border-radius: 20px;
            padding: 20px 0;
            width: 768px;
          }
          .content table{
            width: 90%;
            margin: 18px auto 0;
            border-spacing: 0 10px;
          }
          .content table tr{
            background: #fff;
          }
          .card-title{
            color: #fff;
            font-size: 28px;
            font-weight: 500;
            text-align: left;
            padding-left: 7.5%;
          }
          .social-icon{
            margin: 0 20px;
            width: 40px;
            height: 40px;
          }
      
          @media (max-width:960px) {
            
          }
          @media (max-width:576px) {
            .email-title{
              text-align: left;
            }
            .login-btn{
              width: 100%;
            }
            p{
              font-size: 18px;
            }
            .card-title{
              font-size: 24px;
            }
            .card-img{
              width: 40%;
            }
            .card-text{
              width: 60%;
              padding: 10px 0 10px 15px;
            }
            .card-name{
              font-size: 16px;
              height: 4rem;
            }
            .price-content{
              margin-top: 5%;
            }
            .price{
              font-size: 28px;
            }
            .old-price{
              font-size: 16px;
              margin-right: 5px;
            }
            .price-cut{
              font-size: 16px;
            }
          }
          @supports (-webkit-touch-callout: none) {
            @media (max-width:576px){
              .old-price{
                font-size: 16px;
              }
              .price-cut{
                font-size: 16px;
              }
            }
          }
        </style>
      </head>
      <body>
        <table align="center">
          <tbody style="text-align: center;">
            <tr>
              <td style="padding:30px 0;border-bottom: 3px solid #eee;">
                <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/yesgo_logo_oran.png" alt="" style="display: inline-block;">
              </td>
            </tr>
            <tr>
              <td class="email-title">
                <p style="font-weight: bold;">Hi ${members.name}</p>
                <br>
                <p>生活總是需要點療癒，</p>
                <p>享受美食就是最好的方式，</p>
                <p>讓自己開心一下~</p>
                <p>提醒你yesgogogo追蹤清單內還有你的商品，</p>
                <p>帶它回家吧~~</p>
              </td>
            </tr>
            <tr>
              <td>
                <a style="margin-bottom: 10px;color:#fff" href="https://www.yesgogogo.com/memberboard/membercollection" class="btn login-btn">逛逛追蹤清單</a>
              </td>
            </tr>
            <tr>
              <td id="card-content">
                <div class="card-title">
                  <img style="vertical-align: middle;" src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/loveicon.png" alt="">
                  <span style="vertical-align: middle;">追蹤清單內商品~~</span>
                </div>
                <div class="content">
                  <table>
                    <tbody>
                      ${trackStr}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding-top:40px">
                <small>商品實際資訊以網站為主</small>
                <p>【聯邦集團旗下全台第一家美食特色電商】</p>
                <p><a href="https://www.yesgogogo.com/" style="color:#4285f4">「yesgogogo 即食購」</a></p>
                <p>- 在地美食、安心品質 -</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 0">
                <a href="https://m.facebook.com/130661963637365/">
                  <img class="social-icon" src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/fb_logo.png" alt="">
                </a>
                <a href="http://line.me/ti/p/@yesgogogo">
                  <img class="social-icon" src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/line.png" alt="">
                </a>
                <a href="https://www.youtube.com/channel/UCd6XoBoERkoWsAwjdc6WvpQ">
                  <img class="social-icon" src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/youtube_logo.png" alt="">
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <small>
                  © 2022 聯邦網通科技股份有限公司<br>
                  All Rights Reserved
                </small>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      
      </html>`
      const mailOptions = {
          from: envObj.EMAIL_SENDER,
          to: members.email,
          subject: 'yesgogogo追蹤清單商品通知',
          html: html,
      };
      
      mailTransport.sendMail(mailOptions, function(error, info){
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
      });
    });
  }
  catch(err){
    console.error(err)
  }
  

}

module.exports = sendEmail;