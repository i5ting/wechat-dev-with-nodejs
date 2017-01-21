# nodejs-bigpipe

`分块加载技术`

## 什么是bigpipe

+ 存在很久的一种技术
+ Facebook首创
+ 首屏快速加载的的异步加载页面方案
+ 前端性能优化的一个方向
+ 适合比较大型的，需要大量服务器运算的站点
+ 有效减少HTTP请求
+ 兼容多浏览器

与传统Ajax比较

- 减少HTTP请求数：多个模块更新合成一个请求
- 请求数减少：多个chunk合成一个请求
- 减少开发成本：前端无需多写JavaScript代码
- 降低管理成本：模块更新由后端程序控制
- URL优雅降级：页面链接使用真实地址
- 代码一致性：页面加载不劢态刷新模块代码相同


## 能解决的问题

+ 下载阻塞
+ 服务器与浏览器算力浪费

一句话：`分块加载技术`

## 缺点

不利于SEO搜索引擎(这个说的不太对，可以采用其他手动弥补的)

## 实现方式

> 一个重新设计的基础动态网页服务体系。

> 大体思路是，分解网页成叫做Pagelets的小块，然后通过Web服务器和浏览器建立管道并管理他们在不同阶段的运行。

> 不需要改变现有的网络浏览器或服务器，它完全使用PHP和JavaScript来实现。(此处是错误的，任何语言都可以实现)

## 关键技术点

HTTP 1.1引入分块传输编码

> ### 注：HTTP分块传输编码允许服务器为动态生成的内容维持HTTP持久链接。

HTTP分块传输编码格式
> Transfer-Encoding: chunked
如果一个HTTP消息（请求消息或应答消息）的Transfer-Encoding消息头的值为chunked，那么，消息体由数量未定的块组成，并以最后一个大小为0的块为结束。

Nodejs自动开启 chunked encoding
>除非通过sendHeader()设置Content-Length头。

## Node.js bigpipe实现

### 使用内置的http模块

```js
'use strict'

var http = require('http')

const sleep = ms => new Promise(r => setTimeout(r, ms))

var app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html', 'charset': 'utf-8' })
  
  res.write('loading...<br>')
  
  return sleep(2000).then(function() {
    res.write(`timer: 2000ms<br>`)
    return sleep(5000)
  })
  .then(function() {
    res.write(`timer: 5000ms<br>`)
  }).then(function() {
    res.end()
  })
})

app.listen(3000)

```    


#### 关键字

    res.write('xxxx');
    res.write('xxxx');
    res.write('xxxx');
    res.end('xxxx');

### Express写法

```js
'use strict'

const sleep = ms => new Promise(r => setTimeout(r, ms))

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.type('html');   
  res.write('loading...<br>')
  
  return sleep(2000).then(function() {
    res.write(`timer: 2000ms<br>`)
    return sleep(5000)
  })
  .then(function() {
    res.write(`timer: 5000ms<br>`)
  }).then(function() {
    res.end()
  })
})

app.listen(3000)
```

#### 关键字

> 为什么不用res.send?

因为res.send包括了res.write()和res.end()

### Koa写法

Koa里没有提供对bigpipe的支持，ctx.body赋值做了很多约定。可以说是不太容易控制。

- http模块是基于stream的，所以方案1是通过require('stream').Readable来处理，这种是非常容易理解，但要求大家对stream有一个比较好的理解。
- 方案2，反正Koa和express都是基于http模块的，那么为什么不用http模块的方法呢？

在Koa里有2个概念非常容易混，req和request，res和response，我们经常在express里用req和res，但在Koa里它们指的是http启动server时传入的req和res参数

```
var http = require("http");

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write("Hello World");
    res.end();
}).listen(8888);
```

那么是不是可以不用Koa的东西，改用http的接口呢？res.write和express里的res.write是一样的。

#### Koa 1.x

```js
var koa = require('koa')
var app = koa()
var co = require('co')
const Readable = require('stream').Readable

const sleep = ms => new Promise(r => setTimeout(r, ms))

app.use(function* () {
  const view = new Readable()
  view._read = () => { }

  this.body = view
  this.type = 'html'
  this.status = 200

  view.push('loading...<br>')

  co(function* () {
      yield sleep(2000)
      view.push(`timer: 2000ms<br>`)
      yield sleep(5000)
      view.push(`timer: 5000ms<br>`)

      /** 结束传送 */
      view.push(null)
  }).catch(e => { })
})

app.listen(9092)
```

#### Koa 2.x

```js
const Koa = require('koa')
const app = new Koa()

const sleep = ms => new Promise(r => setTimeout(r, ms))

app.use(require('koa-bigpipe'))

// response
app.use(ctx => {
  // ctx.body = 'Hello Koa'
  ctx.write('loading...<br>')
  
  return sleep(2000).then(function(){
    ctx.write(`timer: 2000ms<br>`)
    return sleep(5000)
  }).then(function(){
    ctx.write(`timer: 5000ms<br>`)
  }).then(function(){
    ctx.end()
  })
})

app.listen(3000)
```

### 问题

> 为什么是按照顺序加载的,怎么能并发加载呢?

+ 这就需要用到promise了 `自行领悟`

[@上面三种情况的项目地址](https://github.com/lduoduo/bigpipe_demo)
```js
    注意!
    分块加载的样式和脚本的加载顺序问题：
    1. 第一次同步给浏览器的内容里如果包含样式和脚本，浏览器会立即请求
    2. 后续的块状内容异步给浏览器后，对应的模块渲染完成，会立即请求模块里的样式文件
    3. 上面第二种情况对js不起作用，浏览器只会渲染，不会做请求!!why??
```
[@上面特殊情况的论证项目地址](https://github.com/lduoduo/mykoa/tree/bigpipe)


## 更多

- 模块解耦
- 前端优化，参考微博的方式
- 性能改进
  - req.js，有http改成rpc
  - 缓存模板
  - 缓存编译结果
-  BigPipe的三种模式：
  - 一次渲染模式：即普通模式，支持搜索引擎，用来支持那些不支持JS的客户端。
  - 管线模式：即并行模式，并行请求，并即时渲染。(已实现)
  - 并行模式：并行请求，但在获得所有请求的结果后再渲染。

## 参考 

> http://velocity.oreilly.com.cn/2011/ppts/WK_velocity.pdf

> [BigPipe：高性能的“流水线技术”网页](https://isux.tencent.com/bigpipe-pipelining-web-pages-for-high-performance.html)

> [nodejs实现bigpipe](https://yuguo.us/weblog/bigpipe-in-nodejs/)

> [nodejs 创建http server](http://blog.csdn.net/swingboard/article/details/43229895)

> [koa 和 bigpipe](http://tech.dianwoda.com/2016/10/26/big-pipe-web-page-rendering-acceleration/)