# commonJS

## commonJS规范和hello world2

### commonJS是一个规范

commonJS是一个规范，讲起来内容会有非常多，我们来点直接的要点

CommonJS对模块的定义十分简单，主要分为模块引用、模块定义和模块标识3个部分。

核心如下

- require - 用来引入依赖
- export - 用来导出模块，包括标识符(identifier)和模块内容(contents)
  - module.exports
  - exports.xxx

下面以helloworld2来演示具体的用法

### 关于 helloworld2

helloworld2会有2个文件，用来演示多文件直接引用关系

- helloworld2.js
- main.js

### 创建`helloworld2.js`

```
module.exports = function () {
  console.log('hello world');
}
```

这里使用`module.exports`导出一个`function`，里面只是打印了`hello world`

下面我们看一下如何在main.js里调用

### 创建`main.js`

```
var hello = require('./helloworld2');

hello()
```

这样需要说明的是，通过require来引用helloworld2这个模块，一旦你require了这个模块，那么这个模块对外暴露的方法或变量，你就可以调用了

再回想一下`module.exports`的作用：当前module暴露的方法或变量

那么此处我们可能会有的疑问

- require引用的是一个本地文件（注意./helloworld2代表的是当前目录下的helloworld2.js），如果是其他库呢？
- module.exports这里只是暴露了一个function，那如果想暴露更多方法或变量呢？

### 执行`main.js`

```
➜  nodejs git:(master) ✗ node demo/main.js
hello world
```

### 我们如果再变一下呢？

helloworld2这个module导出的是一个function，既然是function那么就一定可以直接调用

创建`main.js`

```
require('./helloworld2')();
```

执行

```
➜  nodejs git:(master) ✗ node demo/main2.js
hello world
```

### 那么我如果想跟某人打招呼呢？

创建`helloworld3.js`

```
module.exports = function (person) {
  console.log('hello world ' + person);
}
```

创建`main3.js`

```
require('./helloworld3')('海角');
```

执行

```
➜  nodejs git:(master) ✗ node demo/main3.js
hello world 海角
```

### 我想调用独立函数

创建`helloworld4.js`

```
function say(person) {
  console.log('hello world ' + person);
}

module.exports = say;
```

创建`main4.js`

```
require('./helloworld3')('海角');
```

执行

```
➜  nodejs git:(master) ✗ node demo/main4.js
hello world 海角
```

## 解答疑问

### require引用的是一个本地文件，如果是其他库呢？

（注意./helloworld2代表的是当前目录下的helloworld2.js）

### module.exports这里只是暴露了一个function，那如果想暴露更多方法或变量呢？

我们来假设一下，在helloworld5里既能吃饭又能打招呼呢？

也就是说这个模块要提供2个方法

- 吃饭
- 打招呼

创建`helloworld5.js`

```
function say(person) {
  console.log('i am say hello world to ' + person);
}

function eat(food) {
  console.log('i am eat ' + food);
}

exports.eat = eat;
exports.say = say;
```

创建`main5.js`

```
var h5 = require('./helloworld5')

h5.eat('兰州拉面');

h5.say('海角');
```

执行

```
➜  nodejs git:(master) ✗ node demo/main5.js
i am eat 兰州拉面
i am say hello world to 海角
```

如果你还记得之前的模块是如何导出，你就会对比一下

之前用的是module.exports，现在用的是exports.xxx

那么你好奇，它们有什么差别么？

