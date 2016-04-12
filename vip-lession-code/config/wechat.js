/*!
 * Moajs Config
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var fs            = require('fs');

// 检查用户会话
module.exports = {
 'app_id' : 'wx1207227ce79d76c3',
 'app_secret' : 'b1693148b1b26318c9d8224a17ff0ee1',
 'domain':'http://stuq.mengxiaoban.cn',
 // 'domain':'https://stuq.localtunnel.me',
 'app_token':'mengxiaoban.com',
 'enable_admin': true,
 //for pay
 'mch_id': '1299809901',
 'pfx': fs.readFileSync('./config/pay/stuq/apiclient_cert.p12')
}
