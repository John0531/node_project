const nodemailer = require('nodemailer');
const envObj = require('../../env')
const getHotProduct = require('../getHotProduct')
const getCouponInfo = require('./getCouponInfo')

async function sendEmail(){
  const mailTransport = nodemailer.createTransport({
    host: envObj.SMTP_CONFIG_IP,
    secure: false,
    port: 25,
  });
  
  // * 組合字串
  let insertStr = (source, start, newStr) => {
    return source.slice(0, start) + newStr + source.slice(start)
  }
  try{
    // * 取得熱門商品
    const hotproducts = await getHotProduct()
      
    let hotproductsStr = ''

    for(i=0;i<hotproducts.length;i++){
      hotproductsStr += `<a style="color:#000" href="https://www.yesgogogo.com/productboard/product/${hotproducts[i].productId}">
        <div class="card">
          <div style="padding: 10px;">
            <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/Original/${hotproducts[i].productId}.jpg" alt="">
            <p class="card-name">${hotproducts[i].name}</p>
            <div style="text-align: center;white-space:nowrap">
              <span class="old-price">$${hotproducts[i].oldPrice}</span>
              <span class="price-cut" style="color:#F8412E;">特價$<span class="price">${hotproducts[i].price}</span></span>
            </div>
          </div>
          <div class="btn" style="color:#fff">立即搶購</div>
        </div>
      </a>`
    }

    // * 取得會員折價券資訊
    const couponInfo = await getCouponInfo()
    console.log(couponInfo)
    couponInfo.forEach((members) => {
      let couponsStr = ''
      members.coupons.forEach((coupon)=>{
        coupon.varDUE_DATE_ED = insertStr(coupon.varDUE_DATE_ED,4,'/')
        coupon.varDUE_DATE_ED = insertStr(coupon.varDUE_DATE_ED,7,'/')
        couponsStr += `<tr>
        <td>${coupon.varCOUPON_NAME}</td>
        <td>$${coupon.intDISCOUNT}</td>
        <td>${coupon.varDUE_DATE_ED}</td>
        </tr>`
      })
      console.log(couponsStr)

      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>折價券到期通知信</title>
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
            font-size: 18px;
            display: block;
            text-align: center;
            background: #F8412E;
          }
          .email-title{
            padding-top: 20px;
            font-size: 18px;
          }
          .coupon-table{
            width: 450px;
            padding: 20px 0;
            margin: 0 auto;
            text-align: left;
            font-size: 18px;
          }
          .coupon-table table {
            margin: 0 auto;
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
          .card{
            width: 20%;
            display: inline-block;
            margin: 1rem 0.5rem;
            background: #fff;
          }
          .card img{
            width: 100%; 
          }
          .card p {
            font-size: 16px;
          }
          .old-price{
            text-decoration: line-through;
            margin-right: 10px;
          }
          .price{
            font-size: 36px;
          }
          .card-name{
            height: 4rem;
            margin-bottom: 0;
            overflow: hidden;
          }
          #card-content{
            text-align: center;
            background: #fb9388 url(https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/bg.gif);
            background-position: bottom center;
            background-repeat: no-repeat;
            background-size:100% auto;
            border-radius: 20px;
            padding: 20px 0;
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
            .card{
              width: 46%;
            }
            .card .btn{
              font-size: 16px;
            }
            .card-title{
              padding-left: 3%;
            }
          }
          @media (max-width:576px) {
            .email-title{
              text-align: left;
              font-size: 16px;
            }
            .login-btn{
              width: 100%;
            }
            p{
              font-size: 18px;
            }
            .card{
              margin: 1rem 0.3rem;
            }
            .price{
              font-size: 24px;
            }
            .old-price{
              margin-right: 5px;
            }
            #coupon-table tr td{
              padding-right: 10px;
            }
            .coupon-table{
              width: 100%;
              font-size: 16px;
            }
            .logo{
              padding:30px 0;
              border-bottom: 3px solid #eee;
              width: 100%;
            }
            .logo img{
              display: inline-block;
              width: 100%;
              max-width: 397px;
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
              .coupon-table{
                font-size: 16px;
              }
            }
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <div class="logo">
            <img src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/yesgo_logo_oran.png" alt="">
          </div>
          <div class="email-title">
            親愛的yesgogogo會員 您好<br>
            您的會員中心尚有$XXX折價券，請記得儘快使用噢!
          </div>
          <div class="coupon-table">
            <table>
              <th width="65%">折價券</th>
              <th width="15%">金額</th>
              <th width="20%">到期日</th>
            </thead>
            <tbody id="coupon-table">
              ${couponsStr}
            </tbody>
            </table>
          </div>
        </div>
        <table align="center">
          <tbody style="text-align: center;">
            <tr>
              <td>
                <a href="https://www.yesgogogo.com" class="btn login-btn" style="color:#fff;margin-bottom: 10px;">立即登入使用</a>
              </td>
            </tr>
            <tr>
              <td id="card-content">
                <div class="card-title">
                  <span style="vertical-align: middle;">大家都在買</span>
                  <img style="vertical-align: middle;" src="https://yesgoimages.s3.ap-northeast-1.amazonaws.com/email/goodicon.png" alt="">
                </div>
                <div class="content">${hotproductsStr}</div>
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
          subject: 'yesgogogo折價券到期通知',
          html: html,
      };
        
      mailTransport.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
      });
    });
  }
  catch(err){
    console.log(err)
  }
}
module.exports = sendEmail;