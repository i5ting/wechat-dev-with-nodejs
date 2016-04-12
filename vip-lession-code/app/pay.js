var express = require('express');
var router = express.Router();

var WXPay = require('weixin-pay');

var config = require('../config/wechat');
console.log(config);

var wxpay = WXPay({
    appid:  config.app_id,
    mch_id: config.mch_id,
    // partner_key: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
    pfx: config.pfx, //微信商户平台证书
});


router.get('/', function(req, res, next) {
  
  var openid = req.session.current_user.openid;
  
  var course_id = req.query.id;
  var ordor_id = req.query.ordor_id;
  
  var body = req.query.body;
  var detail = req.query.detail;
  var fee = req.query.fee;
  var cb_url = req.query.cb_url;

  wxpay.getBrandWCPayRequestParams({
      openid: openid,
      body: body,
      detail: detail,
      out_trade_no: ordor_id,
      total_fee: fee,
      spbill_create_ip: '192.168.2.210',
      notify_url: 'http://wxpay_notify_url'+cb_url
  }, function(err, result){
      // in express
      res.json({ data:result })
  });
})



// 原生支付回调
router.use('/wxpay/native/callback', wxpay.useWXCallback(function(msg, req, res, next){
    // msg: 微信回调发送的数据
}));

// 支付结果异步通知
router.use('/wxpay/notify', wxpay.useWXCallback(function(msg, req, res, next){
    // 处理商户业务逻辑
  
  console.log(msg);
  console.log(req);
  console.log(res);
  console.log(next);

  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
  res.success();
}));


module.exports = router;
