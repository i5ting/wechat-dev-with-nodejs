/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var session       = require('express-session')
var MongoStore    = require('connect-mongo')(session);
var mongoose      = require('mongoose');

var half_hour = 3600000 / 2;
// 支持跨域
module.exports = session({
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection 
  }),
  secret: 'moajs.org@me',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: half_hour
  }
})