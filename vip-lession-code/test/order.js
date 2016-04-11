var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

require('../db')

var User = require('../app/models/user')
var Order = require('../app/models/order')
var Course = require('../app/models/course')

var _user, _course;

// 测试代码基本结构
describe('订单Order', function(){
	before(function(done) {
    // runs before all tests in this block
    User.removeAsync({"openid":"ss1"}).then(function(){
      return  Course.removeAsync({"name":"Node.js微信开发1"});
    }).then(function(){
      User.create({"username":"stuq1","password":"password", "openid":"ss1"},function(err, user){        
        _user = user;
        // console.log(err)
        // console.log(_user)
        return Course.create({"name":"Node.js微信开发1","desc":"stuq在线课程", "docent":"桑世龙", owner_id: _user._id},function(err1, c){        
          // console.log(c)
          _course = c;
        
          done();
        });
      });
    })
  })
  after(function(){
     
  })
  beforeEach(function(){
    // runs before each test in this block
  })
  afterEach(function(){
    // runs after each test in this block
  })
  
  describe('#save()', function(){
    it('should return order when order save', function(done){
      Order.create({
        "desc":"a order"
        ,"user_id":_user._id
        , "user_name": _user.username
        ,course_id : _course._id
        ,course_name : _course.name
      },function(err, order){        
        if(err){
          console.log(err)
          expect(err).to.be.not.null;
          done();
        }
        
        expect(order.desc).to.be.a('string');
        expect(order.desc).to.equal('a order');
        done();
      });
    })
  })
})