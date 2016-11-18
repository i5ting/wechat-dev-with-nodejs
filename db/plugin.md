# 了解mongoose的插件机制

Schemas是可以插拔的，也就是说，它们提供在应用预先打包能力来扩展它们的功能。这是非常强大的特性。

## 插件写法

### 基本结构

```
module.exports = exports = function (schema, options) {
  
}
```

参数说明

- schema是schema定义
- options为配置项

### 用法

```
var some_plugin = require('./some_plugin');
var Game = new Schema({ ... });
Game.plugin(some_plugin, { index: true });
```

说明

- `Game`是用户自己定义的`Schema`
- `Game.plugin`是给`Game`增加`plugin`
- `plugin`方法有2个参数
  - 插件对象：`some_plugin`
  - 配置项： `{ index: true }`

比如在数据库里想给所有的collection增加last-modified功能。这时候使用插件是非常简单。仅仅需要创建一个插件，在每个Schema里应用它即可：

## 示例

给所有的collection增加last-modified功能

### 定义
```
// lastMod.js
module.exports = exports = function lastModifiedPlugin (schema, options) {
  schema.add({ lastMod: Date })

  schema.pre('save', function (next) {
    this.lastMod = new Date
    next()
  })

  if (options && options.index) {
    schema.path('lastMod').index(options.index)
  }
}
```

### 调用

```
// game-schema.js
var lastMod = require('./lastMod');
var Game = new Schema({ ... });
Game.plugin(lastMod, { index: true });
```

我们可以看出，整体来说，mongoose的插件机制比较简单，就是通过约定参数`(schema, options) `，然后在函数内部来对schema进行扩展。简单点说，就是在`Game.plugin(lastMod, { index: true });`时，把schema里的变化应用到Game的Schema里。

### schema操作
这不是mongoose里对schema变动的唯一方式。其实都是`schema.add`的功劳。

```
var ToySchema = new Schema;
ToySchema.add({ name: 'string', color: 'string', price: 'number' });
```

我们获得某个Schema，然后自己手动add也是可以的，但要保证的是在定义model之前即可。

### 配置项

配置项也非常有意思，可以结合配置项给schema里的字段增加一些特性，比如增加索引，做一些更复杂的判断等。

```
if (options && options.index) {
  schema.path('lastMod').index(options.index)
}
```

## base-user-plugin

我们再举个例子，用户登录和注册的功能在hook一节已经讲过了，对密码的加密和解密可以说是最常见的需求，那么我们能不能够里有plugin机制完善一下呢？

答案是可以，首先我们观察一下它们的共同点，然后给出可行性分析。

### 可行性分析

hook的核心

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

它们的共同点，无论是`pre`还是`statics`都是对`UserSchema`进行操作。

### 插件定义

而插件定义

```
// lastMod.js
module.exports = exports = function  (schema, options) {
  ...
}
```

可以看出，插件的第一个参数就是`schema`，很明显，它们都是对`schema`操作，基于这个思考，我们可以确定这种改造是可行的。

`mongoose-base-user-plugin`核心代码

```
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = exports = function baseUserPlugin (schema, options) {
  schema.add({
    username      : {// 真实姓名
      type: String,
      required: true
    },
    password      : { // 密码
      type: String,
      required: true
    },
    _salt_bounds: {
      type: Number,
      required: false,
      default : 10
    },
    created_at    : {
      type: Date,
      "default": Date.now
    }
  });
  
  schema.statics.login = function(username, password, cb) {
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

  schema.pre('save', function (next) {
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
  });
  
}
```

这其实和之前讲的的没啥区别，简单封装而已。

### 定义`MyUser`模型

```
var mongoose = require('mongoose');
var base_user = require('.')

var MyUserSchema = new mongoose.Schema({ 
  invite_code   : String, // 邀请码
  phone_number  : Number, // 电话号码
  address       : String, // 地址
  unionid       : String,
  nickname      : String,// from weixin 昵称
  sex           : String,// from weixin 性别 0->女 1->男
  language      : String,// from weixin 语言
  city          : String,// from weixin 城市
  province      : String,// from weixin 
  country       : String,// from weixin
  headimgurl    : String,// from weixin 头像路径
  privilege     : [],    // from weixin
  created_at    : {
    type: Date,
    "default": Date.now
  }

});

MyUserSchema.plugin(base_user);

// 定义Model
var MyUserModel = mongoose.model('MyUser', MyUserSchema);

// 暴露接口
module.exports = MyUserModel;
```

### 测试代码

剩下和之前的测试一样了，我们简单的看一下测试代码

```
import test from 'ava';

// 1、引入`mongoose connect`
require('../connect');

// 2、引入`User` Model
const User = require('../user');

// 3、定义`user` Entity
const user = new User({
  username: 'i5ting',
  password: '0123456789'
});

test.before.cb( t => {
  User.remove({}, (err, u) => {
    t.end()
  })
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
    username: 'i5ting for is_login_valid2',
    password: '0123456789'
  });
  _user.save((err, u) => {
    User.login('i5ting for is_login_valid not exist', '0123456789', function (err, result) {
      if (err) {
        // console.log(err)
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
    username: 'i5ting 2',
    password: '0123456789'
  });
  _user.save((err, u) => {
    // console.log(err)
    User.login('i5ting 2', '0123456', function (err, result) {
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

执行

```
$ npm test

> mongoose-base-user-plugin@1.0.0 test /Users/sang/workspace/github/mongoose-base-user-plugin
> ava -v


数据库连接成功
  ✔ #register() (261ms)
  ✔ #User.login(username, password) fail with username is not exist (269ms)
  ✔ #User.login(username, password) sucess (359ms)
  ✔ #User.login(username, password) fail with password is incorrect (356ms)

  4 tests passed

```

### 集成travis-ci

在根目录创建`.travis.yml`文件

``` 
sudo: false
addons:
  apt:
    sources:
    - ubuntu-toolchain-r-test
    packages:
    - g++-4.8
env:
  - CXX=g++-4.8
language: node_js
node_js:
  - 6
  - 5
  - 4
script: 
  - npm test
services:
  - mongodb
before_script:
  - mongo mongoose-base-user-plugin --eval 'db.addUser("travis", "test");
```

说明

- services指定mongodb连接
- before_script 创建数据库和用户西你想
- addons 使用apt安装g++依赖
- env 定义CXX环境变量

这是因为bcrypt是Node.js的c/c++ addons，需要g++来编译，所以需要g++依赖。如果mac也需要先安装Xcode。

所以如果我们在项目代码里是bcrypt，部署的时候也需要安装g++的。

### 源码

https://github.com/i5ting/mongoose-base-user-plugin


## 总结

mongoose插件机制功能非常强大，又非常简单，对于我们优化代码，复用等有非常明显的帮助，在真实项目里，可以更好的组织代码，可以说是必会的一个特性。