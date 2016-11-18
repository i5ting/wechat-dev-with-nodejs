# mongoose + 异步流程处理

## 万恶的callback


在nodejs入门的章节里我们已经讲了callback约定

```
function (err, result) {
    ...
}
```

Node.js世界里，绝大部分函数都是遵守这个约定的。

举个典型的用户登录的例子吧，这是前面见过的

```
UserSchema.statics.login = function(username, password, cb) {
  this.findOne({
    username: username
  }, function (err, user) {
    if (err || !user) {
      if (err)
        console.log(err);
      
      return cb(err, {
        code: -1,
        msg : username + ' is not exist!'
      });
    }
    
    bcrypt.compare(password, user.password, function(error, res) {
      if (error) {
        console.log(error);
        return cb(err, {
          code: -2,
          msg : 'password is incorrect, please check it again!'
        });
      }
    
      return cb(null, user);
    });
  });
};
```

说明

- login是有callback的
- callback里遵守回调约定`(err,result)`

这里面findOne有一个回调，bcrypt.compare有一个回调，最后解决过通过login的回调传值回去，这还只是一个简单的逻辑，如果更复杂呢？

说callback是万恶的，其实一点也不冤枉，它其实是一种约定，但它却被滥用，导致给Node.js带来了长久以来很多人对Node.js的误解，但本身它只是一种形式，并不是最佳实践，所以持这种态度来看待Node.js是不公平的。


## 内置Promises：mpromise

Mongoose 异步操作，像 .save() 和 queries，返回 Promises/A+ conformant promises. This means that you can do things like MyModel.findOne({}).then() and yield MyModel.findOne({}).exec() (if you're using co).
这就是说你可以做一些像MyModel.findOne({}).then() 和 yield MyModel.findOne({}).exec()（如果你在用co）
 
为了向后兼容，mongoose 4默认返回mpromise promise。

```
var gnr = new Band({
    name: "Guns N' Roses",
    members: ['Axl', 'Slash']
});

var promise = gnr.save();
assert.ok(promise instanceof require('mpromise'));

promise.then(function (doc) {
    assert.equal(doc.name, "Guns N' Roses");
});
``` 
 
https://github.com/aheckmann/mpromise
 
## Queries are not promises
mongoose查询不是promise。可是它有 yield 和 async/await 的 .then() 方法。如果你需要健全的promise，用.exec()方法。

```
var query = Band.findOne({name: "Guns N' Roses"});
assert.ok(!(query instanceof require('mpromise')));

// A query is not a fully-fledged promise, but it does have a `.then()`.
query.then(function (doc) {
    // use doc
});

// `.exec()` gives you a fully-fledged promise
var promise = query.exec();
assert.ok(promise instanceof require('mpromise'));

promise.then(function (doc) {
    // use doc
});
```
 
## 使用其他 Promises 库

在mongoose 4.1.0更新，在mpromise满足基本使用的情况下，高级用户可能想插入他们喜爱的ES6风格的Promise库如bluebird，或只是使用原生的ES6 promise。设置mongoose.Promise 给你喜欢的ES6风格的promise构造函数然后mongoose会使用它。

```
var query = Band.findOne({name: "Guns N' Roses"});

// Use native promises
mongoose.Promise = global.Promise;
assert.equal(query.exec().constructor, global.Promise);

// Use bluebird
mongoose.Promise = require('bluebird');
assert.equal(query.exec().constructor, require('bluebird'));

// Use q. Note that you **must** use `require('q').Promise`.
mongoose.Promise = require('q').Promise;
assert.ok(query.exec() instanceof require('q').makePromise);
``` 

## MongoDB驱动的promise

mongoose.Promise属性设置mongoose使用promise。可是，这不影响底层MongoDB驱动。如果你使用底层驱动，例如Mondel.collection.db.insert()，你需要做点额外工作来改变底层promise库。注意，下面的代码假设mongoose >= 4.4.4。

``` 
var uri = 'mongodb://localhost:27017/mongoose_test';
// Use bluebird
var options = { promiseLibrary: require('bluebird') };
var db = mongoose.createConnection(uri, options);

Band = db.model('band-promises', { name: String });

db.on('open', function() {
    assert.equal(Band.collection.findOne().constructor, require('bluebird'));
});
``` 

## bluebird promisifyAll

promisifyAll是bluebird提供的一个极其方便的api，可以把某个对象上的所有方法都变成返回promise对象方法，在Promise/A+规范里，只要返回promise对象就可以thenable组合完成业务逻辑组合。这是异步流程里比较好的方式。

如果Model里的方法都能返回Promise对象，那么这些方法就可以理解是乐高积木，在我们写业务逻辑时候，组合这些小模块就好了。

promisifyAll会把对象上的方法copy一份返回Promise对象的以“方法名Async”为名称的方法

### 原理

举例db/promisifyAll.js 

```
var UserModel = {
  create: function () {
  },
  retrieve: function () {
  },
  update: function () {
  },
  delete: function () {
  }
}

var Promise = require("bluebird");

// Promisify
Promise.promisifyAll(UserModel);

console.dir(UserModel)
```

执行

```
$ node promisifyAll.js 
{ 
  create: [Function],
  retrieve: [Function],
  update: [Function],
  delete: [Function],
  createAsync: [Function],
  retrieveAsync: [Function],
  updateAsync: [Function],
  deleteAsync: [Function] 
}
```

很明显，create被copy成了createAsync方法，其他亦然。也就是说[原来的方法]变成了[原来的方法Async]

下面看一下createAsync方法是否是返回Promise对象，按照co源码里判断promise的写法

```
function isPromise(obj) {
  return 'function' == typeof obj.then;
}

var is_promise = isPromise(UserModel.createAsync());
console.log(is_promise)
```

返回是true，也就是说createAsync方法是返回的Promise对象。

### 具体实例

```
var mongoose = require('mongoose');
var Promise = require("bluebird");

// 定义Schema
UserSchema = new mongoose.Schema({
  username: {// 真实姓名
    type: String,
    required: true
  },
  password: { // 密码
    type: String,
    required: true
  }
});

// 定义Model
var UserModel = mongoose.model('User', UserSchema);

// Promisify
Promise.promisifyAll(UserModel);
Promise.promisifyAll(UserModel.prototype);

// 暴露接口
module.exports = UserModel;
```

### 步骤说明

步骤1：引入bluebird

```
var Promise = require("bluebird");
```

步骤2：给某个对象应用promisifyAll

```
// Promisify
Promise.promisifyAll(UserModel);
Promise.promisifyAll(UserModel.prototype);
```

### 测试代码

见`db/promisify/test.js`

```
import test from 'ava';

// 1、引入`mongoose connect`
require('../connect');

// 2、引入`User` Model
const User = require('../user/promisify/user');

// 3、定义`user` Entity
const user = new User({
  username: 'i5ting',
  password: '0123456789'
});

test.cb('#thenable for default', t => {
  user.save().then( (user) => {
    // console.log(user)
    t.pass()
    t.end()
  }).catch((err) => {
    t.ifError(err);
    t.fail();
    t.end()
  })
});

test.cb('#thenable for bluebird promisifyAll', t => {
  user.saveAsync().then( (user) => {
    // console.log(user)
    t.pass()
    t.end()
  }).catch((err) => {
    t.ifError(err);
    t.fail();
    t.end()
  })
});

test.cb('#thenable for bluebird Async methods', t => {
  user.saveAsync().then( (u) => {
    return User.findByIdAndUpdateAsync( u._id, {'username' : 'aaaa'})
  }).then((updated_result) => {
    // console.log(updated_result)
    return User.findOneAsync({'username' : 'aaaa'});
  }).then((find_user) => {
    // console.log(find_user)
    t.pass()
    t.end()
  }).catch((err) => {
    t.ifError(err);
    t.fail();
    t.end()
  })
});
```

### 总结：东西虽好，但不要滥用

凡是奇技淫巧都有特定场景的应用场景，虽好，但不要滥用。如果转换非常多，会有性能问题。但是在某些场景，比如模型操作上，还是非常方便、高效的。

## generator in co

http://mongoosejs.com/docs/harmony.html

```
    co(function*() {
      var error;
      var schema = new Schema({
        description: {type: String, required: true}
      });

      var Breakfast = db.model('breakfast', schema, getCollectionName());

      var goodBreakfast = new Breakfast({description: 'eggs & bacon'});

      try {
        yield goodBreakfast.save();
      } catch (e) {
        error = e;
      }

      assert.ifError(error);
      var result;
      try {
        result = yield Breakfast.findOne().exec();
      } catch (e) {
        error = e;
      }
      assert.ifError(error);
      assert.equal('eggs & bacon', result.description);

      // Should cause a validation error because `description` is required
      var badBreakfast = new Breakfast({});
      try {
        yield badBreakfast.save();
      } catch (e) {
        error = e;
      }

      assert.ok(error);
      assert.ok(error instanceof ValidationError);

      done();
    })();
```

## async/await

支持yield，其实就等于支持async/await了，但目前性能测试还不够好，所以暂时还不推荐使用。
