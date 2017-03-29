# route

以前，在app.js里可以写很多很多路由

```
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/2', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/3', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/4', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/5', function(req, res) {
  res.render('index', { title: 'Express' });
});

```

看着啥感觉？

> 路由其实就是分而治之的将具体的处理丢到单独文件中

## 写法

app.js

```
var routes = require('./routes/index');
var users = require('./routes/users');
```

挂载路由

```
app.use('/', routes);
app.use('/users', users);
```


## 具体写法

```
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
```

- get
- post
- patch
- delete
- all

更多见http里的verb章节
