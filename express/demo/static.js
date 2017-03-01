var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
var open     = require("open")
 
// Serve up public/ftp folder 
var serve = serveStatic('public', {'index': ['index.html', 'index.htm']})
 
// Create server 
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})
 
// Listen 
server.listen(3001)


open("http://127.0.0.1:3001");
