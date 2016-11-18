# 回调

- hook.js
- 了解pre和post的差别

我们了解了crud是数据库的基本操作，可是你有想过么？当创建之前需要完成一些操作怎么弄呢？创建完成之后如果需要完成日志类操作呢？

当然我们可以

```
a()
b()
c()
```

其实如果是明确的生命周期，我们其实可以这样

```
pre_b()
b()
post_b()
```

如果这个生命周期类似于模板模式，实现了就起作用，没有实现就走默认行为，是不会非常好呢？在mongoose里其实也提供了类似机制，成为hook。简单点说就是给数据库操作方法增加pre和post回调，当数据库完成某些操作的时候，它会自动触发前置或后置行为的。 


最典型的例子要数用户创建时密码的操作，出于安全的考虑，数据库里是不能明文存储的，md5是一种方式，但还是有一定风险的，所以比较好的办法是采用加盐hash的方法，可以有效的防范彩虹表等破译。


## 注册

在用户注册保存的时候，需要先把password通过salt生成hash密码，并最终赋值给password。

```
UserSchema.pre('save', function (next) {
  var that = this;
  
  bcrypt.genSalt(this._salt_bounds, function(err, salt) {
    if (err) {
      console.log(err);
      return next();
    }
    
    bcrypt.hash(that.password, salt, function(error, hash) {
      if (error) {
        console.log(error);
      }
      
      // console.log(this.password + ' \n ' + hash);
      //生成密文
      that.password = hash;
      
      return next();
    });
  });
})
```

测试

```
var user = new User({
  name :'ss',
  password: 'sdfsfsdfdsf'
});

user.save();
```

## 登录

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

- 当用户名不存在的时候，返回{code: -1}
- 当密码不正确的时候，返回{code: -2}
- 如果校验正确，会返回user具体信息

测试

```
User.login('i5ting for is_login_valid', '0123456789', function (err, result) {
  if (!err) {
    t.pass()
    t.end()
  }
})
```

## 测试代码

db/hook/test.js

```
import test from 'ava';

// 1、引入`mongoose connect`
require('../connect');

// 2、引入`User` Model
const User = require('../user/hook/user');

// 3、定义`user` Entity
const user = new User({
  username: 'i5ting',
  password: '0123456789'
});

test.cb('#register()', t => {
  user.save((err, u) => {
    t.true(u.password.length > 50)
    t.end()
  })
});

test.cb('#User.login(username, password) sucess', t => {
  let _user = new User({
    username: 'i5ting for is_login_valid',
    password: '0123456789'
  });
  _user.save((err, u) => {
    User.login('i5ting for is_login_valid', '0123456789', function (err, result) {
      if (!err) {
        t.pass()
        t.end()
      }
    })
  })
});

test.cb('#User.login(username, password) fail with username is not exist', t => {
  let _user = new User({
    username: 'i5ting for is_login_valid',
    password: '0123456789'
  });
  _user.save((err, u) => {
    User.login('i5ting for is_login_valid not exist', '0123456789', function (err, result) {
      if (err) {
        console.log(err)
        t.pass()
        t.end()
      }
      
      if (result.code === -1) {
        t.pass()
        t.end()
      }
    })
  })
});

test.cb('#User.login(username, password) fail with password is incorrect', t => {
  let _user = new User({
    username: 'i5ting for is_login_valid fail with password is incorrect',
    password: '0123456789'
  });
  _user.save((err, u) => {
    User.login('i5ting for is_login_valid fail with password is incorrect', '0123456', function (err, result) {
      if (err) {
        console.log(err)
        t.fail()
        t.end()
      }
      if (result) {
        t.is(result.username, _user.username)
        t.end()
      }
    })
  })
});
```

执行测试

```
$ npm run hook

> koa-db@1.0.0 hook /Users/sang/workspace/17koa/book-source/db
> ava -v hook/test.js


数据库连接成功
  ✔ #User.login(username, password) fail with username is not exist (214ms)
  ✔ #register() (248ms)
  ✔ #User.login(username, password) fail with password is incorrect (350ms)
  ✔ #User.login(username, password) sucess (372ms)

  4 tests passed
```