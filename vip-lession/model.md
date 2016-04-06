# 建模

## ER模型


　关系数据库或者ER图,这其实是以实体(个体,类)为基础的物理语言,因为关系是实体之间的关系,是由实体来(联合)定义的,所以是实体在先,关系在后的.
　　当然,也有所谓的纯关系项,比如学生成绩(数学分数),既不属于学生,也不属于课程,而是它们的关系存在.


- 三范式
- 笛卡尔积
- 关系：一对一，一对多，多对多
- SQL
- 工具：powerdesigner、erwin


说明：常见的关系型数据库来描述er模型比较多。我们用mongodb也是一样的，处理查询不太一样以外，其他都是一样的。


## 实体

- 用户（微信）
- 课程
- 订单

## 关系

- 我的课程：1对多
-

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
