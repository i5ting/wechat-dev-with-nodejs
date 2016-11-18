# mongoose模型扩展扩展

## 为什么要扩展mongoose模型？

我们对业务进行分层处理

```
service(多模型操作) -> dao（单一模型操作） -> model（模型定义）
```

所以我们在dao层需要很多单一模型的数据库操作方法的封装，如果业务非常复杂，比如一个超级查询方法，然后又有各种具体业务定义方法，难道我们一个一个的都写在dao层么？

事实上dao只做暴露给service的方法，而具有一定业务约定的方法是可以放到model层上做的，如果我们dao层的很多底层方法可以下沉到model，这样就可以让它们的职责更加清晰。所以，我们里有mongoose的模型扩展来重新定义一下分层

```
service(多模型操作) -> dao（单一模型操作） -> model（模型定义 + 扩展方法）
```

mongoose提供的模型模块有2种

- statics：类上扩展
- methods：对象上扩展

根据业务需求来确定，是通过类方法调用，还是通过实体对象上的方法来调用，然后我们根据对应业务，写mongoose相应的扩展即可。下面会分别讲解这2种扩展的差别：

## 方式1 statics：类上扩展

比如我们有这样一个需求，根据用户名查找用户，调用的时候是放到类上好，还是放在实例上好呢？

``` 
UserSchema.statics.find_by_username = function(username, cb) {
  return this.findOne({
    username: username
  }, cb);
};
```

调用

```
User.find_by_username(openid, cb)
```

## 方式2 methods：对象上扩展

```
UserSchema.methods.is_exist = function(cb) {
  var query;
  query = {
    username: this.username,
    password: this.password
  };
  return this.model('UserModel').findOne(query, cb);
};
```

调用

```
var user = new User({});
user.is_exist(cb)
```

## 测试代码

具体测试代码见`db/extend/test.js`

```
import test from 'ava';

// 1、引入`mongoose connect`
require('./connect');

// 2、引入`User` Model
const User = require('./user');

// 3、定义`user` Entity
const user = new User({
  username: 'i5ting',
  password: '0123456789',
  openid  : 'xxxxxx1'
});

const user2 = new User({
  username: 'i5ting for is_exist',
  password: '0123456789',
  openid  : 'xxxxxx2'
});

test('#find_by_username()', t => {
  user.save((err, u) => {
    t.ifError(err)
    
    User.find_by_username('i5ting', (err, user) => {
      t.not(err)
      t.not(user)
      t.is(user.username, 'i5ting');
      t.is(user.password, '0123456789');
    })
  });
});

test('#is_exist()', t => {
  user2.save((err, u) => {
    t.ifError(err)
    // console.log(user)
    var is_exist = u.is_exist();
    t.true(is_exist)
  });
});


test.after(t => {
  User.remove({}, (err, result) => {
    
  })
})
```

执行测试

```
$ cd db
$ npm run extend

> koa-db@1.0.0 extend /Users/sang/workspace/17koa/book-source/db
> ava -v extend/test.js


数据库连接成功
  ✔ #find_by_username()

  1 test passed

```
