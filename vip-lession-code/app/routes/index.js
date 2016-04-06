var express = require('express');
var router = express.Router();

var WechatAPI = require('wechat-api');


var api = new WechatAPI('app_id', 'app_secret');

var jsApiList = [
  'checkJsApi',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'onVoicePlayEnd',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
];
   
router.get('/', function(req, res, next) {
  res.render('index',{title: 'nodeonly'});
})

/* GET home page. */
router.get('/jssdk', function(req, res, next) {
  var param = {
   debug: true,
   jsApiList: jsApiList,
   url: req.query.url
  };
  
  // var result = {
  //     debug: param.debug,
  //     appId: that.appid,
  //     timestamp: timestamp,
  //     nonceStr: nonceStr,
  //     signature: signature,
  //     jsApiList: param.jsApiList
  //   };
  api.getJsConfig(param, function(err, result){
    if(err) {
      res.json({
        status:{
          code: -1,
          msg : err
        }
      })
    }
    return res.json(result);
  });
});


/* GET home page. */
router.get('/share', function(req, res, next) {
  var param = {
   debug: true,
   jsApiList: jsApiList,
   url: req.query.url
  };
  
  // var result = {
  //     debug: param.debug,
  //     appId: that.appid,
  //     timestamp: timestamp,
  //     nonceStr: nonceStr,
  //     signature: signature,
  //     jsApiList: param.jsApiList
  //   };
  api.getJsConfig(param, function(err, result){
    if(err) {
      res.json({
        status:{
          code: -1,
          msg : err
        }
      })
    }
    
    require('extend')(result, param);
    
    return res.render('share', {
      wechat_config: JSON.stringify(result)
    });
  });
});



module.exports = router;
