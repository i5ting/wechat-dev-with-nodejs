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

## hello world

创建`helloworld.js`

```
console.log('hello world');
```

执行

```
➜  nodejs git:(master) ✗ node demo/helloworld.js
hello world
```

这是最简单的例子，只是说nodejs的语法支持前端js语法


## Write a http server use Node.js

```
var http = require('http');

http.createServer(function(request,response){
    console.log(request);
    response.end('Hello world!');
}).listen(8888);
```
