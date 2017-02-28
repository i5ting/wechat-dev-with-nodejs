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

## 熟悉api写法：error-first 和 event



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




## Write a http server use Node.js

```
var http = require('http');

http.createServer(function(request,response){
    console.log(request);
    response.end('Hello world!');
}).listen(8888);
```
