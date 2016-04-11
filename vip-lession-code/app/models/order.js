var LOCK_TIME, MAX_LOGIN_ATTEMPTS, SALT_WORK_FACTOR, Schema, OrderSchema, bcrypt, mongoose;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

OrderSchema = new Schema({
  username: {// 真实姓名
    type: String
  },
  password       : String,
  unionid       : String
});

var OrderModel = mongoose.model('OrderModel', OrderSchema);

Promise.promisifyAll(OrderModel);
Promise.promisifyAll(OrderModel.prototype);

module.exports = OrderModel;