var express = require('express');
var router = express.Router();

var WXPay = require('weixin-pay');

var wxpay = WXPay({
    appid: 'xxxxxxxx',
    mch_id: '1234567890',
    partner_key: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
    pfx: fs.readFileSync('./wxpay_cert.p12'), //微信商户平台证书
});

router.get('/', function(req, res, next) {
  
})


router.get('/:id', function(req, res, next) {
  var cid = req.params.id; 
  Course.findById(cid, function(err, course){
    res.json({
      status:{
        code:0,
        msg:'sucess'
      },
      data:course
    });
  });
  
})

module.exports = router;
