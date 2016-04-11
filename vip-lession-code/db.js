var connectionString, db, mongoose, options;
mongoose = require('mongoose');

var config   = require('./config/mongodb');
var port     = config.port;
var db       = config.db;
var host;

var is_debug = config.is_debug;

if(is_debug) {
  console.log('\033[32m提醒:debug状态连接数据库:\033[39m');
  host  = config.host;
}else{
  console.log('\033[91m警告:非debug状态连接数据库:\033[39m');
  host  = config.host;
}

connectionString = 'mongodb://' + host + ':' + port + '/' + db + '';

options = {
  db: {
    native_parser: true
  },
  server: {
    auto_reconnect: true,
    poolSize: 5
  }
};

console.log(connectionString);

mongoose.connect(connectionString, options, function(err, res) {
  if (err) {
    console.log('[mongoose log] Error connecting to: ', +connectionString + '. ' + err);
    return process.exit(1);
  } else {
    return console.log('[mongoose log] Successfully connected to: ', +connectionString);
  }
});

db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongoose connection error:'));

db.once('open', function() {
  return console.log('mongoose open success');
});


module.exports = db;
