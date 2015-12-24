var connect = require('connect')
var http = require('http')

var app = connect()

app.use('/',function(req, res, next) {
  console.log('i am a middleware.');
  next();
} ,function fooMiddleware(req, res, next) {
  // req.url starts with "/foo"
  res.end('Hello from Connect2!\n');
});

//create node.js http server and listen on port
http.createServer(app).listen(3011)