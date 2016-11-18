# mongoose连接问题

## 机器假死

Linux假死，可理解为能ping通，但是登陆不了，也有是系统panic导致

## 查看sockstat状态

```
$ cat /proc/net/sockstat
sockets: used 863
TCP: inuse 537 orphan 1 tw 872 alloc 712 mem 358
UDP: inuse 4 mem 1
UDPLITE: inuse 0
RAW: inuse 0
FRAG: inuse 0 memory 0
[deploy@iZ251uvtr2bZ ~]$ cat /proc/net/sockstat
sockets: used 864
TCP: inuse 537 orphan 1 tw 785 alloc 713 mem 386
UDP: inuse 4 mem 1
UDPLITE: inuse 0
RAW: inuse 0
FRAG: inuse 0 memory 0
```

发现mem的值非常大，与sysctl -a中的net.ipv4.tcp_mem值比较已经相同，因此无法分配更多的连接

```
$ sysctl -a|grep net.ipv4.tcp_mem
net.ipv4.tcp_mem = 185328	247106	370656
```

通过netstat -an发现大量close_wait状态的连接，原因找到。
 
解决方法;
 
1. close_wait产生的原因
2. 增大tcp_mem的值。



## 使用ulimit设置文件最大打开数

大家都知道Linux系统默认打开文件数是1024，而实际的生产环境中，这个值总是显得太小，而太小的后果就是你的系统会报：too many open files 等这样的错误导致你系统死掉，所以我们总是要修改这个值

```
$ ulimit -a

core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 31225
max locked memory       (kbytes, -l) 64
max memory size         (kbytes, -m) unlimited
open files                      (-n) 64000
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 4096
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```

上面所示的是最大文件打开数，一般情况下是1024，但由于我系统已经改为了64000，所以现在看到的是64000。

我们也可以通过ulimit –n命令来查看最大文件打开数，如下：

```
64000
```

通过ulimit -a 可以查看open files
修改这个限制可以使用ulimt -SHn 65536

### 步骤1：修改/etc/security/limits.conf

通过 vi /etc/security/limits.conf修改其内容，在文件最后加入（数值也可以自己定义）：

```
* soft  nofile = 32768
* hard  nofile = 65536
```
### 步骤2：修改/etc/profile

通过vi /etc/profile修改，在最后加入以下内容

```
ulimit -n 32768
```

然后重新登录即可生效了（开机启动也可以考虑修改/etc/rc.local）。

说明：

其实只修改/etc/profile就可以生效了，但我还是建议把/etc/security/limits.conf也修改一下。

### 步骤3：修改 file-max

```
echo 8061540 > /proc/sys/fs/file-max
```

(此处的数据按照您实际需要调节)

此法解决的实际问题是:在高负载下squid,mysql 会发生 打开的文件数超过系统的进程限制，造成系统瓶颈。
 
 
## 查看mongodb连接数

在终端或robo里执行

```
db.runCommand( { serverStatus: 1 } ).connections
```

返回结果如下

```
/* 1 */
{
    "current" : 88,
    "available" : 51112,
    "totalCreated" : NumberLong(418)
}
```

过一段时间再查

```
/* 1 */
{
    "current" : 92,
    "available" : 51108,
    "totalCreated" : NumberLong(500)
}
```


过一段时间再查

```
/* 1 */
{
    "current" : 92,
    "available" : 51108,
    "totalCreated" : NumberLong(599)
}
```

### 服务器状态里的connections是什么？

A document that reports on the status of the connections. Use these values to assess the current load and capacity requirements of the server.

### connections.current

The number of incoming connections from clients to the database server . This number includes the current shell session. Consider the value of connections.available to add more context to this datum.

The value will include all incoming connections including any shell connections or connections from other servers, such as replica set members or mongos instances.

### connections.available

The number of unused incoming connections available. Consider this value in combination with the value of connections.current to understand the connection load on the database, and the UNIX ulimit Settings document for more information about system thresholds on available connections.

### connections.totalCreated

Count of all incoming connections created to the server. This number includes connections that have since closed.


## 玩玩

如果可用连接available越来越少？直至为0呢？

## mongoose连接池

使用mongoose内置的连接池，配置如下

```
options = {  
  server: {
    auto_reconnect: true,
    poolSize: 10
  }
};
```
说明：

- poolSize是连接池大小
- auto_reconnect是否自动重连接

关于poolSize


poolSize connections are opened to the db when you connect. the default is 5 which is usually plenty【充足的】.

best practice is to open a single mongoose connection and reuse it during the life of your application and close it at application shutdown. if you are opening many many mongoose connections the number of actual connections open will be nMongooseConnections * poolSize.

keep in mind mongodb has a hard limit of 20000 open connections.

Bottom line, the default is probably all you need and only play with the poolSize if you see benefits from your testing.

https://github.com/LearnBoost/mongoose/issues/1172


## 问题出现的可能原因

- 自身出现崩溃。异常没有处理
- 崩溃后pm2自动重启，再崩溃，再重启
- pm2起多个app，每个app多个实例的时候，容易出现雪崩问题

只要出现崩溃问题，就会导致mongodb重连


```
[deploy@i51uvtr2bZ log]$ pm2 ls
┌────────────┬────┬─────────┬──────┬────────┬─────────┬────────┬──────────────┬──────────┐
│ App name   │ id │ mode    │ pid  │ status │ restart │ uptime │ memory       │ watching │
├────────────┼────┼─────────┼──────┼────────┼─────────┼────────┼──────────────┼──────────┤
│ shop       │ 0  │ cluster │ 3809 │ online │ 10      │ 38m    │ 361.148 MB   │ disabled │
│ shop       │ 1  │ cluster │ 3763 │ online │ 8       │ 38m    │ 317.813 MB   │ disabled │
│ shop       │ 2  │ cluster │ 3832 │ online │ 6       │ 38m    │ 372.559 MB   │ disabled │
│ shop       │ 3  │ cluster │ 3786 │ online │ 7       │ 38m    │ 260.098 MB   │ disabled │
```

类似的情况，假设4核，起了4个实例，每个实例创建连接池5个，那么就是20个连接。

那么4个实例的重启总次数31次。

也就是说31 * 20 = 620个连接没有被回收。。。。。

## 解决办法

目前能想到2种

- 定时重启mongodb服务，可以解决，但太low

```
$ sudo service mongod restart
[sudo] password for deploy: 
Restarting mongod (via systemctl):                         [  OK  ]
```

- 在应用程序退出之后，关闭连接（正解） + 外加注意某些地方的异常处理

```
var mongoose   = require('mongoose');
var express    = require('express');

var config     = require('./config/config');

var db_server  = process.env.DB_ENV || 'primary';

mongoose.connection.on("connected", function(ref) {
  console.log("Connected to " + db_server + " DB!");
  
  var app = express();

  // add your middleware set-up
  // add your routes
  
  port = process.env.port || 3000;
  ip = process.env.ip;
  
  app.listen(port, ip, function() {
  console.log('listening on port ' + port);
  });
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB ' + db_server + ' on startup ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB :' + db_server + ' disconnected');
});

var gracefulExit = function() { 
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB :' + db_server + ' is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

try {
  options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };
  mongoose.connect(config.getDBURL(db_server));
  console.log("Trying to connect to DB " + db_server);
} catch (err) {
  console.log("Sever initialization failed " , err.message);
}
```

## 使用native_parser提高性能

```
mongoose.connect(config.db, {auto_reconnect: true, native_parser: true}, function(err) {
    var MongoStore = require("connect-mongodb");
    
    var app = express();
    app.use(express.session({
        cookie: {maxAge: 60000 * 20},
        secret: "secret",
        store: new MongoStore({db: mongoose.connection.db})
    }));
});
```

## session清理问题

```
var express = require('express');
var MongoStore = require('connect-mongo')(express);

app.use(express.session({
  secret: settings.cookie_secret,
  store: new MongoStore({
    "db": "dbName",
    "host": "localhost",
    "port": "27017",
    "collection": "mysessions",
    "clear_interval": 3600,
    "auto_reconnect": true
  })
}));
```

注意clear_interval

## 测试里关闭

```
var mongoose = require('mongoose');

describe('My test', function() {
  before(function(done) {
    //Another possibility is to check if mongoose.connection.readyState equals 1
    if (mongoose.connection.db) return done();
    mongoose.connect('mongodb://localhost/puan_test', done);
  });
});

// You can put one ‘after()’ statement above all else that will run when all tests are finished
after(function(done){
  db.connection.db.dropDatabase(function(){
    db.connection.close(function(){
      done();
    });
  });
});
```

## 连接池

使用mongoose内置的连接池，配置如下

options = {  
  server: {
    auto_reconnect: true,
    poolSize: 10
  }
};
说明：

poolSize是连接池大小
auto_reconnect是否自动重连接
代码

// mongoose config
var mongoose = require('mongoose')  
  , connectionString = 'mongodb://localhost:27017/exam_weixin'
  , options = {};
	
options = {  
  server: {
    auto_reconnect: true,
    poolSize: 10
  }
};
	
mongoose.connect(connectionString, options, function(err, res) {  
  if(err) {
    console.log('[mongoose log] Error connecting to: ' + connectionString + '. ' + err);
  } else {
    console.log('[mongoose log] Successfully connected to: ' + connectionString);
  }
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function callback () {
  // yay!
	console.log('mongoose open success');
});


