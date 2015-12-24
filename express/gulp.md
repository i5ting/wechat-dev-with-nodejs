# practice


## gulp

使用gulp作为构建工具

## livereolad

- nodemon
- supervisor

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

## open


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
