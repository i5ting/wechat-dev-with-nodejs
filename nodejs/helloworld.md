# helloworld

本节主要通过helloworld为例，引申commonJS规范实现，最终打通nodejs模块基础。

## 入门概览 

- 必会js基本语法
- 熟悉api写法：error-first api写法和commonJS规范
- 掌握EvenEmit事件驱动机制
- 掌握Stream，以及HTTP模块中使用Stream的理解
- 掌握Node.js SDK api用法
- 掌握通过npm安装的外部模块用法

## 区分Npm和CommonJS规范

看一下npm

- npm名称是Node Package Manager
- npm是Node.js SDK以外的模块管理器，用于提供安装，卸载，依赖管理等
- npm是管理基于CommonJS规范写的模块的

而CommonJS规范

- CommonJS是一套规范，是模块写法上约定
- Node.js是基于CommonJS规范的实现，并做了改进

总结

- npm是管理基于CommonJS规范写的模块的
- CommonJS是一套规范，是模块写法上约定

## Hello World

创建 `helloworld.js` 文件，并敲入如下代码：

```javascript
console.log('Hello World');
```

在终端里，通过node命令来执行

```shell
$ node demo/helloworld.js
hello world
```

这是最简单的例子，要点如下

- Node.js的语法使用前端JavaScript一样的语法
- JavaScript是脚本语言，需要Node.js解释器 `node` 命令来解释并执行
- console.log是一个用于输出日志的方法，区别在于日志会输出在浏览器端（前端）或terminal终端（Node.js）里

所以，JS语法的掌握是学习Node.js的基础，非常重要，是必需要要掌握的。

## 声明严格模式

举个简单的例子，我们在helloworld.js上增加一个变量a的声明，采用es6里的let关键字

```
console.log('hello world');

let a = 1
```

先通过nvm切换到4版本

```
$ nvm use 4
Now using node v4.7.0 (npm v2.15.11)
```

执行

```
$ node demo/helloworld
demo/helloworld.js:3
let a = 1
^^^

SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
    at exports.runInThisContext (vm.js:53:16)
    at Module._compile (module.js:373:25)
    at Object.Module._extensions..js (module.js:416:10)
    at Module.load (module.js:343:32)
    at Function.Module._load (module.js:300:12)
    at Function.Module.runMain (module.js:441:10)
    at startup (node.js:139:18)
    at node.js:990:3
```

此时，报错说是语法错误（SyntaxError），对于let, const, function, class等关键字的使用在严格模式外还不支持。所以它提示我们使用严格模式。即如下

```javascript
'use strict'

console.log('Hello World');
let a = 1
```

此时再执行就不会报错了。使用`'use strict'` 声明为严格模式，标记严格模式后的好处如下

- 其一，如果在语法检测时发现语法问题，则整个代码块失效，并导致一个语法异常。
- 其二，如果在运行期出现了违反严格模式的代码，则抛出执行异常。

这是我们在使用es6代码，经常要做的事儿，一些低版本的Node.js SDK里很多特性默认是不支持的，需要使用打开严格模式才能使用。

## 熟悉api写法：

- Error-first callback 
- Event-driven

### Error-first callback

Node之所以大量的使用回调函数（callbacks）要追溯到一种比JavaScript语言还要老的编程风格。CPS把函数调用完之后接下来要执行的代码通过闭包包裹并作为函数参数调用要执行的函数。在CPS里，一个 “continuation function” (read: “callback”)会被作为参数传给其他代码调用，这可以让不同的函数在不同应用间进行异步处理。

Node.js需要依赖异步代码才能保证它的快速的执行速度。所以，严重的依赖callback模式是必然的。如果没有它，开发者将陷入到在每个模块之间维护不同签名和风格。将error-first模式引入到Node核心里来解决这个问题的，从此蔓延成为今天所谓的标准。对此褒贬不一，由于过度的callback调用而产生的cellbackhell也是Node.js这么多年里被诟病最多的点。从另一个角度看，也正是Node.js坦诚的暴露缺点，才有了后来前仆后继的异步流程控制的改进。

典型的Error-first callback写法，如下

```
var callback = function(err, data) {
    if (err) { 
		/* do something if there was an error */ 
	}

    /* other logic here */
};
```

上面的代码包含了2个定义error-first callback写法的规则：

- callback函数的第一个参数是error对象。如果发生error，它就被作为第一个参数穿进来，如果没有错误，则err值为null。
- 第二个参数是任何成功响应的data，如果没有error产生，err会被设置为null，并且成功的返回的数据的会放到第二个参数里。

约定是这样的，当往往可能需要传n（n>=2）个参数，其他参数依次排下去。

比如express和connect的中间件

```
// error middleware for errors that occurred in middleware
// declared before this
app.use(function onerror(err, req, res, next) {
  // an error occurred!
});
```

err后面有3个参数，分别是req、res和next，在语义上有一定帮助的情况下，也是允许的。

下面，通过Node.js读取文件内容的api所编写的例子，展示一下sdk里error-first callback用法

```shell
'use strict'

const fs = require('fs')

fs.readFile(__dirname + '/helloworld.js', (err, data) => {
  if (err) throw err
  console.log(data.toString())
});
```

执行

```
$ node demo/readfile.js
console.log('hello world');
```

说明

- 1) 关于返回的data类型

> 官方文档：如果没有指定字符编码，默认返回的data是原始的Buffer类型，如果指定了字符编码返回的就是String类型

推荐

```
fs.readFile('/etc/passwd', 'utf8', callback);
```

- 2）针对err的处理

代码里是直接throw抛出异常：

```
if (err) throw err
```

这里的error其实和其他语言处理类似的。处理方式大致如下

- 自己不管，抛出异常，交给外出调用的处理，或者干脆直接报错
- 自己处理，输出日志或者其他
- 可以结合try/catch或Promise来处理

更多CPS参见：http://matt.might.net/articles/by-example-continuation-passing-style/

### Event-driven

Node.js 所有的异步 `I/O` 操作在完成时都会发送一个事件到事件队列。

EventEmitter类, 是node中事件的基础， 实现了事件模型需要的接口， 包括addListener，removeListener, emit及其它工具方法. 同前端jQuery事件等类似， 采用了发布/订阅(观察者)的方式， 使用内部_events列表来记录注册的事件处理器.

Node 4以前的old做法（es5）

```
var util = require("util");
var EventEmitter = require("events").EventEmitter;

function MyClass() {
    EventEmitter.call(this);
}

util.inherits(MyClass, EventEmitter);

MyClass.prototype.doSomething = function(data) {
    this.emit("doSomething", data);
}
```

过渡做法(在Node.js 4和5)

```
var EventEmitter = require("events").EventEmitter;

class MyEmitter extends EventEmitter {
  constructor() {
    super(); //must call super for "this" to be defined.
  }     
}

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('an event occurred!');
});

myEmitter.emit('event');
```

新做法（es6 + Node 6+）

> 在Node.js 6里 process.EventEmitter 被 deprecated 了,在Node.js 7里移除了process.EventEmitter

```
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
  constructor() {
    super(); //must call super for "this" to be defined.
  }     
}

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('an event occurred!');
});

myEmitter.emit('event');
```

### 出一个考题

给出已有的expirable-hash-table模块，它是一个简单的哈希表，带有TTL(time to live)概念，即当超时后会自动清理该key，这和redis、mongodb里的ttl类似，只是它是一个更小的纯Node.js实现的模块而已。


```
var ExpirableHashTable = require('expirable-hash-table')

var myTable = new ExpirableHashTable(1000) // default timeout in miliseconds

myTable.set('key', 'value', 3000) // optional timeout in miliseconds

myTable.get('key') // -> value
myTable.remove('key') // -> ExpirableHashTable
myTable.has('key') // -> true/false
myTable.purge() // -> ExpirableHashTable
myTable.toArray() // -> Array
myTable.size() // -> Integer

myTable.on('change', function() {
  // A change event is emitted ever time an item is added, updated or removed
})

myTable.once('<key>:expired', function() {
   // A expired event is emitted when a given item expires. Useful if a specific item wants to be monitored. 
})
```

它的风格是事件驱动的方式，能否使用Error-first callback写法？如何写？如果可以，请站在作者的角度上，思考作者这样做的初衷。

## Write a http server use Node.js

```
var http = require('http');

http.createServer(function(request,response){
    console.log(request);
    response.end('Hello world!');
}).listen(8888);
```
