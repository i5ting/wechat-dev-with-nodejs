# 优化


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

