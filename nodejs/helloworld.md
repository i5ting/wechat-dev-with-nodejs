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

## sdk

```shell
fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
## Write a http server use Node.js

```
var http = require('http');

http.createServer(function(request,response){
    console.log(request);
    response.end('Hello world!');
}).listen(8888);
```
