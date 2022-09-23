const ip = require('ip')

const dev = {
    ENV: 'dev',
    EMAIL_SENDER: 'yesgotest@gmail.com',
    DB_CONFIG_PWD: 'wcp@ssw0rd',
    DB_CONFIG_SERVER : '172.28.234.31',
    SMTP_CONFIG_IP : '172.28.233.14',
    EMALL_API_URL : 'https://dev.yesgogogo.com/emall',
}
const prod = {
    ENV: 'prod',
    EMAIL_SENDER: 'yesgogogo@uitc.com.tw',
    DB_CONFIG_PWD: 'YgG#0722%',
    DB_CONFIG_SERVER : '172.28.242.31',
    SMTP_CONFIG_IP : '172.28.241.18',
    EMALL_API_URL : 'https://www.yesgogogo.com/emall'
}

let envObj = {}
const ipAddress = ip.address()

if(ipAddress!=='172.28.241.73'){
  envObj = dev
} else {
  envObj = prod
}

module.exports = envObj