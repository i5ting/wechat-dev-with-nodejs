# MONGOOSEDAO

## DAO

DAO(Data Access Object)是一个数据访问接口，数据访问：顾名思义就是与数据库打交道。夹在业务逻辑与数据库资源中间，以便将低级别的数据访问逻辑与高级别的业务逻辑分离，为不同的数据库提供了一套统一的API。最开始是JavaEE 开发人员使用的，后来其他语言也争相模仿，

在核心J2EE模式中是这样介绍DAO模式的：为了建立一个健壮的J2EE应用，应该将所有对数据源的访问操作抽象封装在一个公共API中。用程序设计的语言来说，就是建立一个接口，接口中定义了此应用程序中将会用到的所有事务方法。在这个应用程序中，当需要和数据源进行交互的时候则使用这个接口，并且编写一个单独的类来实现这个接口在逻辑上对应这个特定的数据存储。

简单点理解是

```
DAO是对单一模型Model操作封装
```

## 什么是mongoosedao

mongoose是orm工具，提供了模型上的丰富的操作方法，但它的api可读性和操作易用性并不能满足我们dao的需求，我们需要有更简单的操作方法，于是mongoosedao应运而生。

https://github.com/moajs/mongoosedao

提供了很多使用api，他们都是模型上的方法，操作起来更加简便

 - create
 - delete = remove
 - deleteAll = removeAll
 - deleteById = removeById
 - getById
 - all = getAll = find({})
 - query = getByQuery = find
 - one = findOne
 - update
 - updateOne
 - updateById
 - pageByLastId
 - top(num) && first(num) = n(num) = latest(num)
 - count(cb) &* count({},cb)
 
 ## 实现原理
 
 其实很简单，就是利用mongoose本身的一些特性，进行约定。
 
 ```
function MongooseDao (Model){
  if(!Model){
    throw new Error(Model + " is not valid, please check if it is a mongoose model!");
  }
  this.model = Model;
  this.pagesize = 20;
}
```

通过把Model作为参数，构建dao对象。

别名,比如find我们把它绑定到dao上，可以叫find也可以叫query

```
MongooseDao.prototype.query = MongooseDao.prototype.find = MongooseDao.prototype.getByQuery = function(query, cb) {
  this.model.find(query, cb);
};
```

比如count，有2种用法

查询全部总数

```
User.count(cb)
```

按条件查询总数

```
User.count({},cb)
```

具体实现代码

```
MongooseDao.prototype.count = function() {
  var query = {};
  var cb;
  //count({a:1},cb)
  if (arguments.length == 2) {
    query   = arguments[0];
    cb      = arguments[1];
  }else{
    //default : count(cb)
    cb      = arguments[0];
  }
  this.model.count(query, cb);
};
```

更新依然

```
// way1: conditions, update , cb
// way2: conditions, update ,options, cb
MongooseDao.prototype.update = function() {
  var conditions, update ,options, cb;
  
  var _options;
  if (arguments.length == 3) {
    _options = {}
    conditions = arguments[0];
    update = arguments[1];
    cb = arguments[2];
  }else if(arguments.length == 4) {
    conditions = arguments[0];
    update = arguments[1];
    _options = arguments[2];
    cb = arguments[3];
  }else{
    throw new Error("MongooseDao.prototype.update param is not valid!")
  }
  
  
  var opt = { multi: true };
  _extend(opt, _options);
  
  this.model.update(conditions, update, opt, cb);
};
```

## 用法

定义模型

```
var TopModel = mongoose.model('TopModel', TopSchema); 
var TopModelDao = new MongooseDao(TopModel);
module.exports = TopModelDao;
```

用法

```
require('./db');

var User = require('./User');

User.create({"username":"sss","password":"password"},function(err, user){
  console.log(user);
});

User.delete({"username":"sss"},function(err, user){
  console.log(user);
});
```

## pagination

### latest = top = first = n

获取指定前20条数

      Top.top(function(err, tops){
        if(err){
          console.dir(err);
        }
        
        // console.dir(tops.length);
        assert.equal(tops.length == 20, true);
        done();
      });
      
获取指定前xx条数
  
      Top.top(30 ,function(err, tops){
        if(err){
          console.dir(err);
        }
        
        // console.dir(tops.length);
        assert.equal(tops.length == 30, true);
        done();
      });
      
根据查询条件获取指定前xx条数
  
      Top.top(30, {}, function(err, tops){
        if(err){
          console.dir(err);
        }
        
        // console.dir(tops.length);
        assert.equal(tops.length == 30, true);
        done();
      });
      
根据查询条件获取指定前xx条数,支持排序
      
      // sort by "field" ascending and "test" descending
      var query = {};
      var sort = {field: 'asc', test: -1 }；
      Top.top(30, query, sort , function(err, tops){
        if(err){
          console.dir(err);
        }
        
        // console.dir(tops.length);
        assert.equal(tops.length == 30, true);
        done();
      });
      
更改pagesize

      Top.pagesize = 25;
      Top.top(function(err, tops){
        if(err){
          console.dir(err);
        }
        
        // console.dir(tops.length);
        assert.equal(tops.length == 25, true);
        done();
      });
      
### pageByLastId

根据id直接返回，长度看Top.pagesize 

    Top.pageByLastId(one._id, function(err, new_tops){
      
根据id直接返回，长度看第二个参数，下面的例子是50

    Top.pageByLastId(one._id, 50, function(err, new_tops){

根据id直接返回，长度看第二个参数，下面的例子是50，不带带有排序条件

    Top.pageByLastId(one._id, 100, {"username" : "fixture-user-41"}, function(err, new_tops){
      
根据id直接返回，长度看第二个参数，下面的例子是50，带有排序条件，created_at是升序

    Top.pageByLastId(one._id, 100, {"username" : "fixture-user-41"}, {created_at:'asc'}, function(err, new_tops){

## mongoosedao + promisifyAll


```
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');

var contactSchema = new Schema(
  {
    "name":"String",
    "address":"String",
    "tel":"String",
    "owner_id":"String",
    "created_at": {
      type: Date,
      "default": Date.now()
    }
  }
);


var Contact = mongoose.model('Contact', contactSchema);
var ContactDao = new MongooseDao(Contact);
var Promise = require("bluebird");

Promise.promisifyAll(Contact);
Promise.promisifyAll(Contact.prototype);

Promise.promisifyAll(ContactDao);
module.exports = ContactDao;
```

注意，为了方便直接使用模型，给模型和dao都增加了promisifyAll方法，核心代码如下

```
var Promise = require("bluebird");

Promise.promisifyAll(Contact);
Promise.promisifyAll(Contact.prototype);

Promise.promisifyAll(ContactDao);
```

## 如何扩展mongoosedao

User.model is a mongoose model. You can do all as mongoose model。

more features

- statics
- methods
- pre or post hook
- aggregation

比如直接扩展方法

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var User = require('../app/models/user');

User.schema.statics.find_by_openid = function(openid, cb) {
  console.log('find_by_openid...')
};

// 此处必须要重置一下model
User = mongoose.model('User', User.schema);

var MongooseDao       = require('mongoosedao');

var UserDao = new MongooseDao(Test);

UserDao.model.find_by_openid({}, function(err,docs){
  // console.dir(docs);
  process.exit();
}); 
```

当然我们更推荐的是在model定义上直接加

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  avatar: String,
  address: String,
  created_at: {
    type: Date,
    "default": Date.now
  }
});

UserSchema.methods.find_by_name = function(cb) {
  return this.model('UserModel').find({
    username: this.username
  }, cb);
};

UserSchema.methods.is_exist = function(cb) {
  var query;
  query = {
    username: this.username,
    password: this.password
  };
  return this.model('UserModel').findOne(query, cb);
};

UserSchema.statics.delete_by_name = function(name, cb_succ, cb_fail) {};

var UserModel = mongoose.model('UserModel', UserSchema);

var MongooseDao = require('../../');

 
var MeetingDao = new MongooseDao(UserModel);
 
module.exports = MeetingDao;
```

只要mongoose支持的，使用mongoosedao都可以完成，甚至更好。

## 总结

mongoosedao是对mongoose操作的约定，提供了更方便的api封装而已，结合bluebird的promisifyAll可以非常好的满足我们日常的业务需求。
