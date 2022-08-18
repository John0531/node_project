const env = 'dev' // ! 改變環境

const dev = {
    DB_CONFIG_PWD: 'wcp@ssw0rd',
    DB_CONFIG_SERVER : '172.28.234.31',
    SMTP_CONFIG_IP : '172.28.233.14'
}
const prod = {
    DB_CONFIG_PWD: 'YgG#0722%',
    DB_CONFIG_SERVER : '172.28.242.31',
    SMTP_CONFIG_IP : '172.28.241.18'
}

let envObj = {}

if(env==='dev'){
    envObj = dev
} else if(env==='prod'){
    envObj = prod
}

module.exports = envObj