# 关系（1对1，1对多，多对多）在mongoose里如何实现

最好的办法还是写一个真实的项目，从博客项目开始。

## 了解关系（1对1，1对多）在mongoose里如何实现

```
UserSchema = new Schema({
    ...
    contacts:[]
});
```

## 了解关系（1对1，1对多，多对多）在mongoose里如何实现

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

## 了解populate

```
ContactSchema = new Schema({
    ...
    owner: {
      type: Schema.ObjectId,
      ref: ‘user’ 
    }
});

ContactSchema.find({}).populate(‘owner’).exec(callback);
```

## 关联真的好么？

从分库分表的角度讲
