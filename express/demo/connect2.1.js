var connect = require('connect')
var http = require('http')

var app = connect()


app.use('/2', function fooMiddleware(req, res, next) {
  // req.url starts with "/foo"
  res.end('Hello from Connect2!\n');
});

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
})


//create node.js http server and listen on port
http.createServer(app).listen(3011)