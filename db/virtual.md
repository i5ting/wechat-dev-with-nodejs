## 了解virtual属性

virtual是虚拟属性的意思，即原来Schema定义里是不存该属性，后来通过virtual方法赋予的属性。可以这样理解，Schema定义的属性是要保存到数据库里，而virtual属性基于已有属性做的二次定义，这样可以提供更好的语义上的处理。

```
模型属性 = Schema定义的属性 + virtual属性
```

下面举几个例子

## 实例1

需求是根据手机号和邀请码来判断该用户是否是有效的，继而完成之后的操作步骤。而数据库只有手机号和邀请码二个字段，那么我们需要怎么做呢？最简单的办法是把状态存在数据库里，加一个字段的事儿。这种方法很好，但对于一个代码洁癖爱好者来说是无法忍受的，明明手机号和邀请码已经可以表达了业务含义，为啥还要多加一个字段呢？

更好的做法就是使用virtual属性，既增加属性，又没有数据库冗余

```
UserSchema.virtual('is_valid').get(function(){
  if(this.phone_number == undefined | this.invite_code == undefined){
    return false;
  }
  return this.invite_code.length >= 2 && this.phone_number > 10000000
});
```

看一下具体测试，主要针对2种情况

- 当同时有invite_code和phone_number
- 当只有phone_number时

```
import test from 'ava';

// 1、引入`mongoose connect`
require('../connect');

// 2、引入`User` Model
const User = require('./user');

// 3、定义`user` Entity
const user_with_invite_code = new User({
  username: 'i5ting',
  password: '0123456789',
  invite_code  : 'xxxx',
  phone_number: 18611112222
});

const user_with_no_invite_code = new User({
  username: 'i5ting',
  password: '0123456789',
  phone_number: 18611112222
});

test('#is_valid() === true if user_with_invite_code', t => {
  user_with_invite_code.save((err, u) => {
    t.true(u.is_valid)
  })
});

test('#is_valid() === false if user_with_no_invite_code', t => {
  user_with_no_invite_code.save((err, u) => {
    t.false(user.is_valid)
  })
});
```

执行

```
$ cd db && ava -v virtual/test.js   

数据库连接成功
  ✔ #is_valid() === true if user_with_invite_code
  ✔ #is_valid() === false if user_with_no_invite_code

  2 tests passed
```

## 实例2

我们给模型增加了一个字段叫address，即用户的地址。一般是保存省、市、区（县）、详细，假设他们是通过`-`作为分隔符存的，但是有的时候保存的数据未必如此，从address字段里，我们如果要获得任意省或市要怎么做呢？

把表拆了，重写？那太不划算了，好的做法是使用virtual属性对字段进行二次加工、转换、格式化等等操作。

```
function _sp (str) {
  return str.replace(/\n/g,'').trim().split('-');
}

UserSchema.virtual('province').get(function () {
  var array = _sp(this.address);
  return array[0];
});

UserSchema.virtual('city').get(function () {
  var array = _sp(this.address);
  return array[1];
});

UserSchema.virtual('county').get(function () {
  var array = _sp(this.address);
  return array[2];
});

UserSchema.virtual('detail_address').get(function () {
  var array = _sp(this.address);
  return array[2];
});
```

这样就可以在不变表结构的情况下，增加`province`,`city`,`county`,`detail_address`，这是非常便捷的，无入侵的。

测试代码

```
import test from 'ava';

// 1、引入`mongoose connect`
require('../connect');

// 2、引入`User` Model
const User = require('../user/virtual/user2');

// 3、定义`user` Entity
const user = new User({
  username: 'i5ting',
  password: '0123456789',
  address  : '天津-天津-东丽区-空港商务园'
});

test.before.cb(t => {
  User.remove({}, (err, result) => {
    t.end()
  })
})

test('#province city county detail_address', t => {
  user.save((err, u) => {
    t.is(u.province, '天津')
    t.is(u.city, '天津')
    t.is(u.county, '东丽区')
    t.is(u.detail_address, '空港商务园')
  })
}); 
```


执行

```
$ cd db && ava -v virtual/address.js 

数据库连接成功
  ✔ #province city county detail_address

  1 test passed
```
