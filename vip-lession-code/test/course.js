var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

require('../db')

var User = require('../app/models/user')
var Course = require('../app/models/course')
var Order = require('../app/models/order')

var _user;

// 测试代码基本结构
describe('Course', function(){
	before(function(done) {
    // runs before all tests in this block
    User.create({"username":"stuq","password":"password", "openid":"ss"},function(err, user){        
      _user = user;
      done();
    });
  })
  after(function(){
    // runs after all tests in this block
    // User.remove({},function(err, user){
    // });
  })
  beforeEach(function(){
    // runs before each test in this block
  })
  afterEach(function(){
    // runs after each test in this block
  })

  describe('#save()', function(){
    it('should return Node.js微信开发 when Course save', function(done){
      Course.create({"name":"Node.js微信开发","desc":"stuq在线课程", "docent":"桑世龙", owner_id: _user._id},function(err, c){        
        if(err){
          console.log(err)
          expect(err).to.be.not.null;
          done();
        }
        
        expect(c.name).to.be.a('string');
        expect(c.name).to.equal('Node.js微信开发');
        done();
      });
    })
  })
})