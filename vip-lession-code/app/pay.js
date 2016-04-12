var express = require('express');
var router = express.Router();

var WXPay = require('weixin-pay');

var config = require('../config/wechat');
console.log(config);

var wxpay = WXPay({
    appid:  config.app_id,
    mch_id: config.mch_id,
    partner_key: config.app_secret, //微信商户平台API密钥
    pfx: config.pfx, //微信商户平台证书
});


router.get('/', function(req, res, next) {
  
  var openid = req.session.current_user.openid;
  console.log('openid = ' + openid)
  
  var course_id = req.query.id;
  var ordor_id = req.query.order_id;
  
  var body = req.query.body;
  var detail = req.query.detail;
  var fee = req.query.fee;
  var cb_url = req.query.cb_url;
  
  var req_ip = req.ip.replace('::ffff:','')
  
  var out_trade_no = req.query.order_id;
  var call_back_url = config.domain + cb_url;
  
  var p = {
    openid: openid,
    body: req.query.body,
    detail: req.query.detail,
    out_trade_no: out_trade_no,// 2015_10_14_18_37_187949638969
    total_fee: parseInt(req.query.fee),
    spbill_create_ip: req_ip,// 请求的ip地址
    notify_url: call_back_url
    // prepay_id:out_trade_no
  }
  console.log(p);
  wxpay.getBrandWCPayRequestParams(p, function(err, result){
      console.log(err);
      console.log(result);
      // in express
      res.json({ data:result })
  });
})

// 仅供测试支付成功后回调使用
router.post('/pay_calllback/:id', function(req, res, next){
  console.log(req.params)
  console.log('/wechats/pay_calllback post sucess')
});  


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
