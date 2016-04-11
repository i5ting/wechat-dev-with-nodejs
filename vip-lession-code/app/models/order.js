var LOCK_TIME, MAX_LOGIN_ATTEMPTS, SALT_WORK_FACTOR, Schema, OrderSchema, bcrypt, mongoose;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

OrderSchema = new Schema({
  desc: {// 订单说明
    type: String
  },
  "user_id": { //user_id
    type: Schema.ObjectId,
    index: true,
    required: true,
    ref: 'User'
  },
  user_name: {// 用户名
    type: String
  },
  "course_id": { //user_id
    type: Schema.ObjectId,
    index: true,
    required: true,
    ref: 'Course'
  },
  course_name: {// 课程名
    type: String
  },
  created_at    : {
    type: Date,
    "default": Date.now
  }
});


// 根据用户查询所有订单
OrderSchema.statics.find_all_by_user_id = function(user_id, cb) {
  return this.find({
    user_id: user_id
  }, cb);
};


// 根据课程查询所有订单
OrderSchema.statics.find_all_by_course_id = function(course_id, cb) {
  return this.find({
    course_id: course_id
  }, cb);
};


var OrderModel = mongoose.model('Order', OrderSchema);

Promise.promisifyAll(OrderModel);
Promise.promisifyAll(OrderModel.prototype);

module.exports = OrderModel;