# AGGREGATION 关联

## 什么是AGGREGATION？

## mongoose AGGREGATION

调用Model.aggregate()将会返回aggregate实例，他具有如下这些方法：

### append

往aggregate管道里添加一个新的操作，比如新增加一个match匹配方式：

```
aggregate.append({ $project: { field: 1 }}, { $limit: 2 });

// or pass an array
var pipeline = [{ $match: { daw: 'Logic Audio X' }} ];
aggregate.append(pipeline);
```

只是一个语法糖的效果，方便统一的api

### exec

执行当前的aggregate管道内容，和之前的其他find操作一样，传入一个回调函数，执行这次计算操作，这里不多说。

### allowDiskUse

在mongodb 2.6之后加入，告诉mongodb是否需要将本次汇总计算时暂时用硬盘存储。

### cursor

批量设置游标大小

### group

分组操作，表示对某些字段进行分组，比如我们对department字段进行分组：

```
aggregate.group({ _id: "$department" });
```


### limit

表示限制返回集合的大小，例如：

```
aggregate.limit(10);
```


### match

表示汇总计算的筛选条件，比如：

```
aggregate.match({ department: { $in: [ "sales", "engineering" } } });
```

就是从以上条件中进行group分组汇总操作

### near

查找附近的记录，如下代码：

```
aggregate.near({
  near: [40.724, -73.997],
  distanceField: "dist.calculated", // required
  maxDistance: 0.008,
  query: { type: "public" },
  includeLocs: "dist.location",
  uniqueDocs: true,
  num: 5
});
```

### project

根据project表达式指定输入的字段或者计算的字段，语法如下：

```
{ $project: { <specifications> } }
```
比如有如下文档：

```
{
  "_id" : 1, 
  title: "abc123",
  isbn: "0001122223334",
  author: { last: "zzz", first: "aaa" },
  copies: 5
}
```

指定_id、title，author出现在输出的文档中：

```
{ 
    $project : { 
    title : 1 , 
    author : 1 
    }
 }
 ```

经过操作之后，就将输出

```
{ "_id" : 1, "title" : "abc123", "author" : { "last" : "zzz", "first" : "aaa" } }
```

当然，在之前也可以指定内嵌文档的字段，比如上面可以指定只输出author.last。 也可以通过加入计算操作，生成新的文档，数据库有如下文档：

```
{
  "_id" : 1,
  title: "abc123",
  isbn: "0001122223334",
  author: { last: "zzz", first: "aaa" },
  copies: 5
}
```

进行如下操作

```
db.books.aggregate(
   [
      {
         $project: {
            title: 1,
            isbn: {
               prefix: { $substr: [ "$isbn", 0, 3 ] },
               group: { $substr: [ "$isbn", 3, 2 ] },
               publisher: { $substr: [ "$isbn", 5, 4 ] },
               title: { $substr: [ "$isbn", 9, 3 ] },
               checkDigit: { $substr: [ "$isbn", 12, 1] }
            },
            lastName: "$author.last",
            copiesSold: "$copies"
         }
      }
   ]
)
```

操作之后的结果如下：

```
{
   "_id" : 1,
   "title" : "abc123",
   "isbn" : {
      "prefix" : "000",
      "group" : "11",
      "publisher" : "2222",
      "title" : "333",
      "checkDigit" : "4"
   },
   "lastName" : "zzz",
   "copiesSold" : 5
}
```

### read

当查询汇总操作时的读取偏好，可以从以下这些中设置一个：

- ReadPreference.PRIMARY，从分布式部署的主库PRIMARY读取，如果主库PRIMARY不能访问则会报异常，默认设置
- ReadPreference.PRIMARY_PREFERRED，从主库读取，如果主库不能访问，则尝试从SECONDARY读取
- ReadPreference.SECONDARY，从SECONDARY读取数据，否则报异常
- ReadPreference.SECONDARY_PREFERRED，从SECONDARY读取，否则从PRIMARY读取
- ReadPreference.NEAREST，从延迟最小的一个节点读取数据，无论主从

### skip

表示跳过多少条记录

```
aggregate.skip(10);
```

### sort

对计算结果排序

```
// 下面这些是等价的
aggregate.sort({ field: 'asc', test: -1 });
aggregate.sort('field -test');
```

### unwind

将输入的文档数组解构，看个例子就明白了，有如下文档数据：

```
{ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] }
```

进行unwind操作：

```
db.inventory.aggregate( [ { $unwind : "$sizes" } ] )
```

输出结果：

```
{ "_id" : 1, "item" : "ABC1", "sizes" : "S" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "M" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "L" }
```


### Aggregate中的一些操作关键字

- $and，与操作
- $or，或操作
- $not，非操作
- $setEquals，设置列是否相同，相同返回true


如下数据：

```
{ "_id" : 1, "A" : [ "red", "blue" ], "B" : [ "red", "blue" ] }
{ "_id" : 2, "A" : [ "red", "blue" ], "B" : [ "blue", "red", "blue" ] }
{ "_id" : 3, "A" : [ "red", "blue" ], "B" : [ "red", "blue", "green" ] }
{ "_id" : 4, "A" : [ "red", "blue" ], "B" : [ "green", "red" ] }
{ "_id" : 5, "A" : [ "red", "blue" ], "B" : [ ] }
{ "_id" : 6, "A" : [ "red", "blue" ], "B" : [ [ "red" ], [ "blue" ] ] }
{ "_id" : 7, "A" : [ "red", "blue" ], "B" : [ [ "red", "blue" ] ] }
{ "_id" : 8, "A" : [ ], "B" : [ ] }
{ "_id" : 9, "A" : [ ], "B" : [ "red" ] }
```

进行操作：

```
db.experiments.aggregate(
   [
     { $project: { A: 1, B: 1, sameElements: { $setEquals: [ "$A", "$B" ] }, _id: 0 } }
   ]
)
```

执行的结果如下：

```
{ "A" : [ "red", "blue" ], "B" : [ "red", "blue" ], "sameElements" : true }
{ "A" : [ "red", "blue" ], "B" : [ "blue", "red", "blue" ], "sameElements" : true }
{ "A" : [ "red", "blue" ], "B" : [ "red", "blue", "green" ], "sameElements" : false }
{ "A" : [ "red", "blue" ], "B" : [ "green", "red" ], "sameElements" : false }
{ "A" : [ "red", "blue" ], "B" : [ ], "sameElements" : false }
{ "A" : [ "red", "blue" ], "B" : [ [ "red" ], [ "blue" ] ], "sameElements" : false }
{ "A" : [ "red", "blue" ], "B" : [ [ "red", "blue" ] ], "sameElements" : false }
{ "A" : [ ], "B" : [ ], "sameElements" : true }
{ "A" : [ ], "B" : [ "red" ], "sameElements" : false }
```

- $setIntersection 找出数组中多个内嵌文档数组中的相同的内容
- $setUnion 找出数组中多个内嵌文档数组非重复内容
- $setDifference 找出数组中多个内嵌文档数组中的不同的内容
- $setIsSubset 判断数组A是不是包含数组B
- $anyElementTrue 判断文档数组中是否含有一个值是true的
- $allElementsTrue 判断数组都是是否都为true值
- $cmp 如果两个值相同，返回0，1或-1表示不同
- $eq 判断两个值是否相同
- $gt 第一个值大于第二个值，返回true
- $gte 第一个值大于等于第二个值，返回true
- $lt 第一个值小于第二个值，返回true
- $lte 第一个值小于等于第二个值，返回true
- $ne 第一个值不等于第二个值，返回true

字符串操作：

- $concat 将字符串拼接.
- $substr 截断字符串
- $toLower 转小写
- $toUpper 转大写
- $strcasecmp 当两个字符串相同返回0，当第一个大于第二个返回1，第二个大于第一个返回-1 文字搜索操作：
$- meta 好像是计算汇总命中率 数组操作：
- $size 返回数组的长度

变量操作

$map 将每一条记录都经过map操作， { $map: { input: , as: , in: }

例如有数据：

```
{ _id: 1, quizzes: [ 5, 6, 7 ] }
{ _id: 2, quizzes: [ ] }
{ _id: 3, quizzes: [ 3, 8, 9 ] }
```

执行map操作：

```
db.grades.aggregate(
   [
      { $project:
         { adjustedGrades:
            {
              $map:
                 {
                   input: "$quizzes",
                   as: "grade",
                   in: { $add: [ "$$grade", 2 ] }
                 }
            }
         }
      }
   ]
)
```

输出结果，每个都加了2

```
{ "_id" : 1, "adjustedGrades" : [ 7, 8, 9 ] }
{ "_id" : 2, "adjustedGrades" : [ ] }
{ "_id" : 3, "adjustedGrades" : [ 5, 10, 11 ] }
```

$let 可以绑定变量，通过计算输出结果

文字操作：

- $literal 返回一个解析的值

日期操作：

- $dayOfYear 返回日期类型那个中的年的日期，1-366
- $dayOfMonth 返回日期类型中的月中的日期，1-31
- $dayOfWeek 返回周几1-7
- $year 返回年
- $month 返回月1-12
- $week 返回周1-53
- $hour 返回小时0-23
- $minute 返回分钟0-59
- $second 返回秒0-59
- $millisecond 返回毫秒0-999

条件表达式：

- $cond 条件表达式，类似if then else：
- $cond: { if: { $gte: [ "$qty", 250 ] }, then: 30, else: 20 }
- $ifNull 如果条件是null，则返回第三个参数值，如果不是null则返回真实值： description: { $ifNull: [ "$description", "Unspecified" ] }

累加器：

- $sum 累加每个列的数值，如果不是数字将忽略
- $avg 平均所有列的数值
- $first 获取第一个文档指定列的数值
- $last 获取最后一个文档指定列的数值
- $max 获取分组中最大的数值
- $min 获取分组中最小的数值
- $push 将指定列数值放入数组
- $addToSet 将指定列的数值，唯一的值放入数组中

日期统计

```
  Partaker.aggregate({
    $group:{
      _id:{year:{$year:"$time.join"},month:{$month:"$time.join"},day:{$dayOfMonth:"$time.join"}},
      count:{$sum:1}
    }
  },{
    $group:{
      _id:{year:"$_id.year",month:"$_id.month"},
      dailyusage:{$push:{day:"$_id.day",count:"$count"}}
    }
  },{
    $group:{
      _id:{year:"$_id.year"},
      monthlyusage:{$push:{month:"$_id.month",dailyusage:"$dailyusage"}}
    }
  },function(err,partakers){
    if(err) console.error(err);
    log.info({partakers:partakers},'结果');
  });
``` 

## 已有SQL经验，如何快速学习

《SQL to Aggregation Mapping Chart》
http://docs.mongodb.org/manual/reference/sql-aggregation-comparison/

## 总结

