# mongodb安全

## mongodb

掌握权限，理解下面4条

1. mongodb是没有默认管理员账号，所以要先添加管理员账号，在开启权限认证。
1. 切换到admin数据库，添加的账号才是管理员账号。
1. 用户只能在用户所在数据库登录，包括管理员账号。
1. 管理员可以管理所有数据库，但是不能直接管理其他数据库，要先在admin数据库认证后才可以。这一点比较怪

### 先以默认配置启动

先以默认配置启动mongodb

```
  mongod --dbpath tmp/db --logpath tmp/logs/mongodb.log --pidfilepath tmp/pids/mongodb.pid 
```

### 增加用户

```
use admin
use cnodejsng
db.createUser({user:"cnodejs",pwd:"cnodejs.ng",roles:[{role:"readWrite",db:"cnodejsng"}]})
db.runCommand({usersInfo:"cnodejs",showPrivileges:true})
db.auth('cnodejs','cnodejs.ng')
```

超级用户的role有两种，userAdmin或者userAdminAnyDatabase.不建议创建，给数据一个readWrite角色就够了

### 重启mongodb服务器，限制授权和ip地址

```
mongod  -auth --bind_ip 127.0.0.1 --port 27017 --dbpath tmp/db --logpath tmp/logs/mongodb.log --pidfilepath tmp/pids/mongodb.pid &
```

如果是在项目路径

```
  killall mongod && gulp start_mongodb
  ```
  
### 客户端连接

```
mongo -ucnodejs -pcnodejs.ng 127.0.0.1:27017/cnodejsng
```
  
### 注：

1. 和用户管理相关的操作基本都要在admin数据库下运行，要先use admin
2. 如果在某个单一的数据库下，那只能对当前数据库的权限进行操作;
3. db.addUser是老版本的操作，现在版本也还能继续使用，创建出来的user是带有root role的超级管理员。

tips

- show roles查看角色
- db.runCommand({usersInfo:"cnodejs"})




   
cnode 由于 mongo 就在本地，所以我只是很简单地 bind 127.0.0.1 就没干别的了

g 4楼•1 年前    
@alsotang

use admin
太可怕了，还是要小心的



在mongoose里修改连接信息

mongoose = require('mongoose')
connectionString = 'mongodb://127.0.0.1:27017/cnodejs'

options =
  db:
    native_parser: true
  server:
    auto_reconnect: true
    poolSize: 5
  # replset: rs_name: 'myReplicaSetName'
  user: 'cnodejs'
  pass: 'cnodejs.ng'

mongoose.connect connectionString, options, (err, res) ->
  if err
    console.log('[mongoose log] Error connecting to: '
      + connectionString + '. ' + err)
    process.exit 1
  else
    console.log('[mongoose log] Successfully connected to: '
      + connectionString)

db = mongoose.connection
db.on('error', console.error.bind(console, 'mongoose connection error:'))
db.once 'open', () ->
  console.log('mongoose open success')
  
  
  