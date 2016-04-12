#wechat-demo


http://127.0.0.1:3019/demo/helloworld-weui2+iscroll2.html


## User用户

```
  username: {// 真实姓名
    type: String
  },
  password       : String,
  unionid       : String,
  openid: {// from weixin openid
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  nickname      : String,// from weixin 昵称
  sex           : String,// from weixin 性别 0->女 1->男
  language      : String,// from weixin 语言
  city          : String,// from weixin 城市
  province      : String,// from weixin
  country       : String,// from weixin
  headimgurl    : String,// from weixin 头像路径
  privilege     : [],    // from weixin
  created_at    : {
    type: Date,
    "default": Date.now
  }
```

## Course课程

```
  name: {// 课程名
    type: String
  },
  pic: {// 课程图片
    type: String,
    "default": "/images/logo.png"
  },
  desc: {// 描述
    type: String,
    "default": "这是StuQ的一门在线课程"
  },
  price: {// 价格
    type: Number
  },
  docent: {// 讲师
    type: String
  },
  content: {// 大纲
    type: String
  },
  owner_id: { //user_id
    type: Schema.ObjectId,
    index: true,
    required: true,
    ref: 'User'
  },
  created_at: {
    type: Date,
    "default": Date.now
  }
```
## 订单

```
  desc: {// 订单说明
    type: String
  },
  "user_id": { //user_id
    type: Schema.ObjectId,
    index: true,
    required: true,
    ref: 'User'
  },
  user_name: {// 用户名
    type: String
  },
  "course_id": { //user_id
    type: Schema.ObjectId,
    index: true,
    required: true,
    ref: 'Course'
  },
  course_name: {// 课程名
    type: String
  },
  created_at    : {
    type: Date,
    "default": Date.now
  }
```

## migrate

node migrate/init.js


## API


### 获取课程列表

curl http://127.0.0.1:3019/api/courses