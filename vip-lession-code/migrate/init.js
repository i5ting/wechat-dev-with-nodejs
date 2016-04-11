require('../db')

var User = require('../app/models/user')
var Course = require('../app/models/course')
var Order = require('../app/models/order')

var _user, _c

User.createAsync({"username":"sang","password":"000000", "openid":"stuq-open-id"})
.then(function(user){
  _user = user;
  return  Course.createAsync({"name":"StuQ - Node.js微信开发","desc":"stuq在线课程", "docent":"桑世龙", owner_id: _user._id})
}).then(function(){
  return  Course.createAsync({"name":"StuQ - Node.js微信开发","desc":"stuq在线课程", "docent":"桑世龙", owner_id: _user._id})
}).then(function(){
  return  Course.find_all_by_owner_id(_user._id)
}).then(function(courses){
  console.log(courses)
});
