/*!
 * Moajs Config
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var fs            = require('fs');

// 检查用户会话
module.exports = {
 'app_id' : 'wx04014b02a0a61c90',
 'app_secret' : 'cc4c224b5018370cf6ffc95ad2be309c',
 // 'domain':'http://shop.mengxiaoban.cn',
 'domain':'https://i5ting2.localtunnel.me',
 'app_token':'mengxiaoban.com',
 'enable_admin': true,
 //for pay
 'mch_id': '1229607702',
 'pfx': fs.readFileSync('./config/pay/xbm/apiclient_cert.p12'), //微信商户平台证书
 //callback
 callback:{
   url     : '/wechats/callback2',
   attr    : 'openid',
   success : '/oauth',
   failed  : '/404'
 }
}
