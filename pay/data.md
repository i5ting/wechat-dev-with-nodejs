# 数据处理

## csv处理

- i-csv
- import-csv
- export-csv
- json2csv
- fastcsv

### json2csv

json to csv converter

https://github.com/i5ting/json2csv

## import-csv

https://github.com/i5ting/import-csv

默认使用gbk编码


```
var import_csv = require('import-csv')

import_csv('test.csv',function(err, data){
  console.log(data);
})
```

指定字符编码机

```
var import_csv = require('import-csv')

import_csv('test.csv',function(err, data){
  console.log(data);
}, 'gbk')
```


## export-csv

https://github.com/i5ting/export-csv

默认使用gbk编码

```
var export_csv = require('.')

var data = [
  {a:1,b:2},
  {a:2,b:2},
  {a:3,b:2}
]
export_csv(data, 'test1.csv')
```

过滤item，重写数据

```
var export_csv = require('.')

var data = [
  { a: 1, b: 2 },
  { a: 2, b: 2 },
  { a: 3, b: 2 }
]
export_csv(data, 'test3.csv', function (item) {
  for (var key in item) {
    item[key] = 'yy +' + item[key];
  }
  return item;
})
```

指定回调函数

```
var export_csv = require('.')

var data = [
  {a:1,b:2},
  {a:2,b:2},
  {a:3,b:2}
]
export_csv(data, 'test2.csv', function (item) {
  return item;
}, function () {
  console.log('end...');
})
```

指定回调函数，并生成header

```
var export_csv = require('.')

var data = [
  {a:1,b:2},
  {a:2,b:2},
  {a:3,b:2}
]
export_csv(data, 'test2.csv', function (item) {
  return item;
}, function () {
  console.log('end...');
}, true)
```

## mongodb如何统计

```
var json2csv = require('json2csv');
require('../db.js');
var fs = require('fs');
var Order = require('../app/models/order');
var Activity = require('../app/models/activity');
var Wechat = require('../app/models/wechat');
var Contact = require('../app/models/contact');

function main(){
  Order.model.aggregate([
    {$match : {status2 : {$exists : true} }},
    {$group : {_id : "$activity" , count : {$sum : "$product_count"}}}
    ]).exec(function (err, data) {
        var obj = [];
        for (var i = data.length - 1; i >= 0; i--) {
          var json = {
            "url" : "http://shop.mengxiaoban.cn/iscroll.html?id=" + String(data[i]._id),
            "count" : String(data[i].count)
          }
          obj.push(json);
          console.log(json.url);
        }
        var opts = {
          data: obj,
          fields: ['url','count'],
          fieldNames: ['url','count'],
          quotes: ''
        };
        json2csv(opts, function(err, csv) {
          if (err) console.log(err);
          fs.writeFile('./1119todayurl.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
          });
        });
      })
  }
}

main();

```

AGGREGATION 关联

《SQL to Aggregation Mapping Chart》

http://docs.mongodb.org/manual/reference/sql-aggregation-comparison/


## 优化查询速度


了解索引优化

```
 ContactSchema = new Schema({
    ...
    owner: {
      type: Schema.ObjectId,
      required: true,
      index: true
    }
});

```

也可以这样的

```
ContactSchema.ensureIndexes(owner);
```


## 了解explain

```
 db.usermodels.find({
  '_id' :{ 
    "$gt" :ObjectId("55940ae59c39572851075bfd")
  } 
}).explain()
```

关注点

- stage：查询策略
- nReturned：返回的文档行数
- needTime：耗时（毫秒）
- indexBounds：所用的索引

http://docs.mongodb.org/v3.0/reference/explain-results/



## 了解profile

profile级别有三种：

- 0：不开启
- 1：记录慢命令，默认为大于100ms
- 2：记录所有命令
- 3、查询profiling记录
开启

```
db.setProfilingLevel(2, 20)
```

默认记录在system.profile中

```
db['system.profile'].find()
```


## MONGODB的部署

- replset
- shard


我写的《 mongodb运维之副本集实践》

https://cnodejs.org/topic/5590adbbebf9c92d17e734de