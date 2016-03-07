# 随堂练习：完成登录、注册功能

## 学习mongodb

- http://nodeonly.com/nodesang/#/4
- https://github.com/DanialK/Simple-Authentication


## 添加mongoose

```
mkdir models
npm i -S mongoose
npm i -S mongoosedao
```

在路由里增加创建代码

### 配置

配置mongodb链接信息

- config/mongodb.example.js
- db.js

```
cp config/mongodb.example.js config/mongodb.js
```

### 创建models/user.js

```
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');

var userSchema = new Schema(
    {
      "name":"String",
      "password":"String"
    }
);

var User = mongoose.model('User', userSchema);
var UserDao = new MongooseDao(User);

module.exports = UserDao;
```

### 测试user.js

```
var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

require('../db')

var User = require('../models/user')

// 测试代码基本结构
describe('UserModel', function(){
	before(function() {
    // runs before all tests in this block
  })
  after(function(){
    // runs after all tests in this block
  })
  beforeEach(function(){
    // runs before each test in this block
  })
  afterEach(function(){
    // runs after each test in this block
  })

  describe('#save()', function(){
    it('should return stuq when user save', function(done){
      User.create({"name":"stuq","password":"password"},function(err, user){
        if(err){
            expect(err).to.be.not.null;
            done();
        }

        expect(user.name).to.be.a('string');
        expect(user.name).to.equal('stuq');
        done();
      });
    })
  })
})
```

在测试完成后需要在after里删除测试数据，保证测试完整性，自己写吧

### 在路由里增加user创建和api测试

routes/user.js

```
var User = require('../models/user')

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  User.create({
    "name":name,
    "password":password
  },function(err, user){
    if(err){
      res.json('register failed with err');
    }

    res.json('register sucess');
  });
});
```

test/user_api.js

```
var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

var app = require('../app');

require('../db')

describe('POST /users/register', function(){
  it('respond register with json', function(done){
    request(app)
      .post('/users/register')
      .field('name', 'stuq')
      .field('password', '123456')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })
})
```

测试

```
mocha -u bdd test/user_api.js
```

## 登录

routes/user.js

```
var User = require('../models/user')

router.post('/login', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  User.findOne({
    "name":name,
    "password":password
  },function(err, user){
    if(err){
      res.json('register failed with err');
    }

    res.json('register sucess');
  });
});
```

这是示意，实际代码的密码地方是不会这样写的。采用加盐加密方式

