var LOCK_TIME, MAX_LOGIN_ATTEMPTS, SALT_WORK_FACTOR, Schema, UserSchema, bcrypt, mongoose;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

Schema = mongoose.Schema;

SALT_WORK_FACTOR = 10;

MAX_LOGIN_ATTEMPTS = 5;

LOCK_TIME = 2 * 60 * 60 * 1000;

UserSchema = new Schema({
  username: {// 真实姓名
    type: String
  },
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

UserSchema.virtual('is_valid').get(function(){
  console.log('phone_number = ' +this.phone_number)
  if(this.phone_number == undefined | this.invite_code == undefined){
    return false;
  }
  return this.invite_code.length >= 2 && this.phone_number > 0
});

// 检查是否填写过邀请信息
UserSchema.virtual('is_invited').get(function(){
  if(typeof this.weixin_name == 'undefined'){
    return false;
  }
});

UserSchema.methods.is_exist = function(cb) {
  var query;
  query = {
    username: this.username,
    password: this.password
  };
  return this.model('UserModel').findOne(query, cb);
};

UserSchema.statics.findAll = function(cb) {
    return this.find().sort({ created_at: 'asc'}).exec(cb);
};

UserSchema.methods.save_necessary = function(cb) {
  var update = {
    invite_code: this.invite_code,
    phone_number: this.phone_number,
    address:this.address
  };

  return this.model('UserModel').findByIdAndUpdate(this.id, update, cb);
};

UserSchema.statics.find_by_openid = function(openid, cb) {
  return this.findOne({
    openid: openid
  }, cb);
};

UserSchema.statics.find_by_unionid = function(unionid, cb) {
  return this.findOne({
    unionid: unionid
  }, cb);
};

UserSchema.statics.find_by_nickname = function(nickname, cb) {
  return this.findOne({
    nickname: nickname
  }, cb);
};

UserSchema.plugin(autoIncrement.plugin, {
  model: 'XbmId',
  field: 'xbm_id',
  startAt: 10000,
  incrementBy: 1
});

var UserModel = mongoose.model('UserModel', UserSchema);

Promise.promisifyAll(UserModel);
Promise.promisifyAll(UserModel.prototype);

module.exports = UserModel;