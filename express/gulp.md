# practice


## gulp

使用gulp作为构建工具

## livereolad

- nodemon
- supervisor


以前是

```
$ node app.js
```

现在是

```
$ nodemon app.js
```

唯一的问题就是debug比较麻烦

## pm2 和forever

- forever 过时了
- pm2 现在用的最多

https://github.com/Unitech/pm2



## browser-sync

- browser-sync

```
gulp.task('less_server',['build_less'] ,function () {
    browserSync.init({
      proxy: "127.0.0.1:3005"
    })
    gulp.watch('./public/css/main.less', ['build_less']);
    gulp.watch('./public/*.html',function () {
      browserSync.reload();
    });
});
```

## 自动挂载路由

- mount-routes

http://github.com/moajs/mount-routes

```
var express = require('express')
var app = express()

var mount = require('mount-routes');

// simple
// mount(app);
// with path
// mount(app, __dirname + '/routes2');

// with path & api dump
mount(app,  __dirname + '/routes2', true);

// start server
app.listen(23018)
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
