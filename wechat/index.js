var fs          = require('fs');
var WechatAPI   = require('wechat-api');
var appid       = 'wxcf3bf35d1b43000f'
var secret      = '31e02099193f61c8d5744ad31af19f01'

var API = require('wechat-api');
var api = new API(appid, secret);
api.setOpts({timeout: 15000});


api.sendText('o12hcuKXjejDFUwxMgToaGtjtqf4', 'Hello world', function(err, txt){
  
  console.log(err)
  console.log(txt)
});