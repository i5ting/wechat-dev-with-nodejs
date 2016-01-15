# extend


## 最简单继承（属性拷贝）

```
function extend(des, src) {
  if (!des) {
    des = {};
  }
  if (src) {
    for (var i in src) {
      des[i] = src[i];
    }
  }

  return des;
}
```

## xtend

层级只有1层的对象拷贝覆盖，只需要xtend即可，核心是for循环复制，稍微判断了一下前一个对象是否有该属性

https://github.com/Raynos/xtend

类似于jquery的extend方法

```
 $ npm install --save xtend
```

具体使用

```
var extend = require("xtend")

// extend returns a new object. Does not mutate arguments
var combination = extend({
    a: "a",
    b: 'c'
}, {
    b: "b"
})
// { a: "a", b: "b" }
```

## deep-extend

层级只有多层的对象拷贝覆盖

https://github.com/unclechu/node-deep-extend

```
 $ npm install --save deep-extend
```

具体使用

```
var deepExtend = require('deep-extend');
    var obj1 = {
        a: 1,
        b: 2,
        d: {
            a: 1,
            b: [],
            c: { test1: 123, test2: 321 }
        },
        f: 5,
        g: 123,
        i: 321,
        j: [1, 2]
    };
    var obj2 = {
        b: 3,
        c: 5,
        d: {
            b: { first: 'one', second: 'two' },
            c: { test2: 222 }
        },
        e: { one: 1, two: 2 },
        f: [],
        g: (void 0),
        h: /abc/g,
        i: null,
        j: [3, 4]
    };

    deepExtend(obj1, obj2);

    console.log(obj1);
    /*
    { a: 1,
      b: 3,
      d:
       { a: 1,
         b: { first: 'one', second: 'two' },
         c: { test1: 123, test2: 222 } },
      f: null,
      g: undefined,
      c: 5,
      e: { one: 1, two: 2 },
      h: /abc/g,
      i: null,
      j: [3, 4] }
    */
```
