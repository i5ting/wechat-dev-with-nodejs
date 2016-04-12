require('./db')

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var session       = require('./app/middlewares/session');


var pay = require('./app/pay')

var app = require('base2')({
  // debug: true,
  // root:__dirname,
  "views": "app/views",
  "routes": "app/routes",
  "public": "frontend",
  pre: function (app) {
    if (app.debug) {
      console.log('pre hook');
    }
    
    app.use(session);
  },
  after: function (app) {
    if (app.debug) {
      console.log('pre hook');
    }
    
    app.use('/pay', pay);
  }
})

// console.log(app);
// app.mount_routes(__dirname + '/routes2');
// app.mount_plugins(__dirname + '/plugins');
app.start(3019);