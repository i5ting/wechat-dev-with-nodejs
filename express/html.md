# webserver: html && publc

## 静态server

- apache(LAMP之a)
- nginx(LNMP之n)

每个http server framework里都内置的，虽然以后不会用

## serve-index

基于connect的中间件

- [Serve directory listings](https://www.npmjs.com/package/serve-index)


## serve-static

基于connect的中间件

- [Serve static files](https://www.npmjs.com/package/serve-static)


## express static

```
var express  = require('express');
var app      = express();
var path     = require('path');
var open     = require("open");

app.use(express.static(path.join(__dirname, 'www/')));

app.get('/', function (req, res) {
  res.send('Hello World')
})

// 随机端口3000 - 10000 之间
app.listen(4001)

open("http://127.0.0.1:4001");
```


## open

```
var express  = require('express');
var app      = express();
var path     = require('path');
var open     = require("open");

app.get('/', function (req, res) {
  res.send('Hello World')
})

// 随机端口3000 - 10000 之间
app.listen(4001)

open("http://127.0.0.1:4001");
```

## 实现一个简单的网页

- 创建html
- 创建css和js和images目录
- 完成hello world

## 其他

nodejs里可以使用更简单的办法完成这事儿

```
npm i -g http-server

http-server . -p 8080 -o
```
