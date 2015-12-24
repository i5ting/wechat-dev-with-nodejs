var express  = require('express');
var app      = express();

app.use(function (req, res, next) {
  res.send('global middleware....')
})

function m1(req, res) {
  console.log('m1...');
}

function m2(req, res) {
  console.log('m2...');
}

app.get('/', m1, m2, function (req, res) {
  res.send('Hello World')
})

// 随机端口3000 - 10000 之间
app.listen(4001)