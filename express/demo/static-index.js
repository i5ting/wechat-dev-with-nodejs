var finalhandler = require('finalhandler')
var http = require('http')
var serveIndex = require('serve-index')
var serveStatic = require('serve-static')
 
// Serve directory indexes for public/stylesheets folder (with icons) 
var index = serveIndex('public/', {'icons': true})
 
// Serve up public/ftp folder files 
var serve = serveStatic('public')
 
// Create server 
var server = http.createServer(function onRequest(req, res){
  var done = finalhandler(req, res)
  serve(req, res, function onNext(err) {
    if (err) return done(err)
    index(req, res, done)
  })
})
 
// Listen 
server.listen(3002)