var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

require('../db')

var User = require('../app/models/user')
var Order = require('../app/models/order')

console.log(Order)

// 测试代码基本结构
describe('OrderModel', function(){
	before(function() {
    // runs before all tests in this block
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
    it('should return stuq when user save', function(done){
      User.create({"username":"stuq","password":"password", "openid":"ss"},function(err, user){        
        if(err){
          console.log(err)
          expect(err).to.be.not.null;
          done();
        }
        
        expect(user.username).to.be.a('string');
        expect(user.username).to.equal('stuq');
        done();
      });
    })
  })
})