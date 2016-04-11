/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var fs = require('fs');


// for raw data post
module.exports = function (req, res, next) {
  req.wx = {
    'app_id' : 'wx04014b02a0a61c90',
    'app_secret' : 'cc4c224b5018370cf6ffc95ad2be309c',
    'domain':'https://zhvplpfvfj.localtunnel.me',
    'app_token':'mengxiaoban.com',
    'enable_admin': true,
    //for pay
    'mch_id': '1229607702',
    'pfx': fs.readFileSync('./pay/cert/apiclient_cert.p12'), //微信商户平台证书
    //callback
    callback:{
      success : '/wechats',
      failed  : '/404'
    }
  }
  
  next();
};