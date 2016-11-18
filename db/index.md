# 索引优化

## 什么是索引？

数据库的索引与书籍的索引类似，有了索引就不需要翻转整本书。数据库的索引跟这个原理一样，首先在索引中找，在索引中找到条目以后，就可以直接跳转到目标文档的位置，从而使查询速度提高几个数据量级。

不使用索引的查询称为全表扫描（这个术语来源于关系型数据库），也就是说，服务器必须查找完一整本书才能找到查询结果。这个过程跟我们在一本没有索引（目录）的书中查找信息很像：从第一页开始一直读完整本书。通常来说，应该尽量避免使用全表扫描，因为对于大集合来说，全表扫描的效率非常低。

虽然MongoDB的索引在存储结构上都是一样的，但是根据不同的应用层需求，还是分成了唯一索引（unique）、稀疏索引（sparse）、多值索引（multikey）等几种类型。

Mongodb的索引几乎与关系型数据库的索引一模一样，所以适用于关系型数据库索引优化技巧，在这里就不多说了。

## mongodb创建索引

创建索引使用db.collectionName.ensureIndex(...)方法进行创建；

### 1、创建普通索引
 
```
> db.users.ensureIndex({"name":1})
```  

这样就在users这个集合上面的name字段上面创建了一个name_1的索引，{"name":1}说明建立的索引是升序的，如果{"name":-1}说明创建的索引是降序的。
 
### 2、创建普通复合索引
 
```
db.users.ensureIndex({"name":1,"age":1})  
```

这样就在users这个集合上面的name和age字段上面创建了一个name_1_age_1的索引.
 
### 3、创建唯一索引

唯一索引可以确保集合里面的每一个文档指定的键都有唯一值。例如，如果想保证不同文档的name键拥有不同的值，创建一个唯一索引就可以了：

```
> db.dept.ensureIndex({"name":1},{"unique":true}) 
``` 

创建完唯一索引以后，如果想向dept集合中添加如下文档：
 
```
> db.dept.insert({ "_id" : 1, "name" : "ickes" })  
> db.dept.insert({ "_id" : 2, "name" : "ickes" })  
```

会发现只有第一个文档添加进去了，添加第二个时就会抛出异常，所以使用唯一索引来应对偶尔可能出现键重复的问题，而不是在运行时对重复键进行过滤。"_id"就是这中类型的索引，这个索引会在创建集合时自动创建。
 
### 4、创建复合唯一索引

创建复合唯一索引时，单个键的值可以相同，但是所有键的组合的值必须是唯一的。
 
```
> db.users.ensureIndex({"name":1,"age":1},{"unique":true})  
```

### 5、创建唯一索引时去除重复  

在已有的集合上面创建唯一索引时，可能失败，因为集合中可能已经存在重复值了，如下所示：
 
```
> db.dept.find()   
{ "_id" : 1, "name" : "ickes" }  
{ "_id" : 2, "name" : "ickes" }  
{ "_id" : 3, "name" : "ickes1" }  
{ "_id" : 4, "name" : "eks" }  
{ "_id" : 5, "name" : "eks" }  
```

从上面的集合中看出name已经有大量重复值，创建唯一索引时抛出异常

```  
> db.dept.ensureIndex({"name":1},{"unique":true})  
{  
        "createdCollectionAutomatically" : false,  
        "numIndexesBefore" : 1,  
        "ok" : 0,  
        "errmsg" : "E11000 duplicate key error index: test.dept.$name_1  dup key  
: { : \"eks\" }",  
        "code" : 11000  
}  
```

通常需要对已有的数据进行处理（可以使用聚合框架，后面会说），找出重复的数据，想办法处理。
     在极少数情况下，可能希望直接删除重复的值。创建索引时使用"dropDups"选项，如果遇到重复的值，第一个会被保留，之后的重复文档都会被删除。

```
>  db.dept.ensureIndex({"name":1},{"unique":true,"dropDups":true})  
{  
        "createdCollectionAutomatically" : false,  
        "numIndexesBefore" : 1,  
        "numIndexesAfter" : 2,  
        "ok" : 1  
}  
```

"dropDups"会强制性的建立唯一索引，但是这个方式太粗暴了：你无法控制那些文档需要被保留，那些文档需要被删除（从上面打印的信息可以看出，如果文档被删除了，MongoDB也不会给出提示信息）。对于比较重要的数据，千万不要使用"dropDups".

### 6、创建稀疏索引

唯一索引会把null值看做值，所以无法将缺少键的多个文档插入到建立的唯一索引的集合中。然而，在某些情况下，你可能希望唯一索引只针对包含相应键的文档生效。如果有一个可能存在也有可能不存在的字段，当字段存在时是唯一索引，不存时不做处理，这时就可以将unique和sparse选项组合在一起使用。

使用sparse选项就可以创建稀疏索引。例如集合的结构如下：

```
> db.sparse.find()  
{ "_id" : 1, "x" : 1 }  
{ "_id" : 2, "x" : 2 }  
{ "_id" : 3, "x" : null }  
{ "_id" : 4 }  
```
   
创建稀疏索引

```
> db.sparse.ensureIndex({"x":1},{"unique":true,"sparse":true})
```
  
稀疏索引不必是唯一的。只要去掉unique选项，就可以创建一个非唯一的稀疏索引

MongoDB的稀疏索引与关系型数据库中的稀疏索引是完全不同的概念。基本上来说，MongoDB中的稀疏索引只是不需要将每个文档都作为索引条目。那么问题来了，根据是否使用稀疏索引，同一个查询的返回结果可能不同。

例如上面文档，当在x上面执行查询时，他会返回相应匹配的文档：

```
> db.sparse.find({"x":{"$ne":1}}).hint({}) --hint({})强制不使用索引  
{ "_id" : 2, "x" : 2 }  
{ "_id" : 3, "x" : null }  
{ "_id" : 4 }  
```

如果在x字段上面使用索引，那么{ "_id" : 4 }的文档将不会返回，因为他不在索引中，例如：

```
> db.sparse.find({"x":{"$ne":1}}).hint({"x":1})  
{ "_id" : 3, "x" : null }  
{ "_id" : 2, "x" : 2 }  
```

## mongoose索引类型

```
var mongoose = require('mongoose');

mongoose.Schema.indexTypes.forEach(index => {
  console.log(index)
})
```

执行

```
$ node mongoose/indexTypes.js
2d
2dsphere
hashed
text
```

## mongoose索引定义

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

## 插件里如何增加索引？

## 总结

## 索引类型

MongoDB提供了一些不同的索引类型支持的数据和查询的具体类型

- Default _id (默认_id索引)
- Single Field (单字段索引)
- Compound Index (复合索引[多字段索引])
- MultiKey Index (多键索引)
- Geospatial Index (地理空间索引)
- Text Indexes (文本索引)
- Hashed Indexes (哈希码索引)

### Default _id (默认_id索引)

所有mongodb默认都有一个_id字段索引，如果我们不指定_id的值会自动生成一个ObjectId值。
该_id索引是唯一的，并且可以防止客户端对_id字段值相同插入两个。

    # 查询articles集合的索引
    db.articles.getIndexes();
    # 添加titlei字段索引，并且为升序
    db.articles.ensureIndex({title:1});
    #重构索引(慎用)
    db.articles.reIndex();
    
注意：索引排序规则升序：1，降序-1

### Single Field (单字段索引)

mongodb允许定义单个字段的索引，与default _id一样，只是字段不同。

### Compound Index (复合索引[多字段索引])

mongodb中可以自定多个字段的索引。例如，如果一个复合指标包括{userid：1，score：-1 }，索引排序第一的用户名后，在每一个用户标识符值，按得分++倒序++排序。

    {
        "_id": ObjectId(...),
        "item": "Banana",
        "category": ["food", "produce", "grocery"],
        "location": "4th Street Store",
        "stock": 4,
        "type": "cases",
        "arrival": Date(...)
    }
    
创建方法：

    # 创建item、stock字段的复合索引，并且升序排序
    db.products.ensureIndex( { "item": 1, "stock": 1 } )
    注意：Hashed 字段不能创建索引，如果创建将出现错误

Application Sort Order 使用案例：降序用户名升序时间。

    # 查询结果集中排序
    db.events.find().sort( { username: -1, date: 1 } )
    # 查询结果集中排序
    db.user_scores.find().sort({score:-1,date:-1}).limit(1)
    # 执行相关查询可以看出查询效率大大提高


### MultiKey Index (多键索引)

官方文档中给出这样一个案例：

    {
        userid:"marker",
        address:[
            {zip:"618255"},
            {zip:"618254"}
        ]

    }
    # 创建索引,并将zip升序排列
    db.users.ensureIndex({"address.zip": 1});

    # 假如我们做这样的查询
    db.users.find({"addr":{"$in":[{zip:"618254"}]}})
    
注意：你可以创建 多键复合索引(multikey compound indexes)

### Geospatial Index (地理空间索引)

    db.places.ensureIndex( { loc : "2dsphere" } )

### Text Indexes (文本索引)

文本索引是在2.4版本更新的，提供了文本搜索文档中的集合功能，文本索引包含：字符串、字符数组。使用$text做查询操作。

2.6版本 默认情况下使文本搜索功能。在MongoDB 2.4，你需要使文本搜索功能手动创建全文索引和执行文本搜索

    # 创建文本索引 (2.6你就不用这么麻烦了哦)
    db.articles.ensureIndex({content:"text"});
    
复合索引可以包含文本索引 称为：复合文本索引(compound text indexes)，但有限制

1. 复合文本索引不能包含任何其他特殊索引类型，比如：多键索引(multi-key Indexes)
2. 如果复合文本索引包含文本索引的键，执行$text查询必须相同查询条件。可能翻译不对原文：
（If the compound text index includes keys preceding the text index key, to perform a $text search, the query
predicate must include equality match conditions on the preceding keys1）

### Hashed Indexes (哈希码索引)

哈希索引在2.4版本更新的，将实体的的哈希值作为索引字段，

    # 给user_scores的score字段创建一个哈希索引
    db.user_scores.ensureIndex( { score: "hashed" } )
