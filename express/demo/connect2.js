var connect = require('connect')
var http = require('http')

var app = connect()

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
})

app.use('/2', function fooMiddleware(req, res, next) {
  // req.url starts with "/foo"
  res.end('Hello from Connect2!\n');
});

//create node.js http server and listen on port
http.createServer(app).listen(3011)