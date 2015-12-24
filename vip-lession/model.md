# 建模

- 微信用户
- 课程
- 订单

## 微信用户

```
/**
 * Created by alfred on August 25th 2015, 6:11:46 pm.
 */

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');

var wechatSchema = new Schema({
  unionid       : String,
  openid: {// from weixin openid
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  nickname      : String,// from weixin 昵称
  sex           : String,// from weixin 性别 0->女 1->男
  language      : String,// from weixin 语言
  city          : String,// from weixin 城市
  province      : String,// from weixin 
  country       : String,// from weixin
  headimgurl    : String,// from weixin 头像路径
  privilege     : [],    // from weixin
  created_at    : {
    type: Date,
    "default": Date.now
  }
});


wechatSchema.statics.find_by_openid = function(openid, cb) {
  return this.findOne({
    openid: openid
  }, cb);
};

wechatSchema.statics.find_by_unionid = function(unionid, cb) {
  return this.findOne({
    unionid: unionid
  }, cb);
};

var Wechat = mongoose.model('Wechat', wechatSchema);
var WechatDao = new MongooseDao(Wechat);
 
module.exports = WechatDao;
```

## 课程列表


## 订单