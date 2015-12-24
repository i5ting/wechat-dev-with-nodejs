# route


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
