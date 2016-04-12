require('./db')

var fs            = require('fs');


var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var res_api       = require('res.api');
var mount         = require('mount-routes');
var session       = require('./app/middlewares/session');

var app = express();

app.use(res_api);
app.use(session);

// jsonp callback setup
app.set('jsonp callback name', 'callback');

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'frontend', 'favicon.ico')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend')));
 
// simple
mount(app, __dirname + '/app/routes');
 
var pay = require('./app/pay')
app.use('/pay', pay);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3019)

module.exports = app;
