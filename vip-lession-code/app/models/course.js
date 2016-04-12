var LOCK_TIME, MAX_LOGIN_ATTEMPTS, SALT_WORK_FACTOR, Schema, CourseSchema, bcrypt, mongoose;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

CourseSchema = new Schema({
  name: {// 课程名
    type: String
  },
  pic: {// 课程图片
    type: String,
    "default": "/images/logo.png"
  },
  desc: {// 描述
    type: String,
    "default": "这是StuQ的一门在线课程"
  },
  price: {// 价格
    type: Number
  },
  docent: {// 讲师
    type: String
  },
  content: {// 大纲
    type: String
  },
  owner_id: { //user_id
    type: Schema.ObjectId,
    index: true,
    required: true,
    ref: 'User'
  },
  created_at: {
    type: Date,
    "default": Date.now
  }
});

// 根据用户查询所有课程
CourseSchema.statics.find_all_by_owner_id = function(owner_id, cb) {
  return this.find({
    owner_id: owner_id
  }, cb);
};

var Course = mongoose.model('Course', CourseSchema);

Promise.promisifyAll(Course);
Promise.promisifyAll(Course.prototype);

module.exports = Course;