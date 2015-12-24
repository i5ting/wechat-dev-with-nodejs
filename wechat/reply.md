# 回复

## 能干什么？

## 流程

![](wechat.png)

## wechat

- https://github.com/node-webot/wechat

```
npm i --save wechat
```

## token

- wx50b97d02c86f6c26
- a50b4bd3fa1949624b7c404c6d48bda0

## 回复消息

当用户发送消息到微信公众账号，自动回复一条消息。这条消息可以是文本、图片、语音、视频、音乐、图文。详见：[官方文档](http://mp.weixin.qq.com/wiki/index.php?title=%E5%8F%91%E9%80%81%E8%A2%AB%E5%8A%A8%E5%93%8D%E5%BA%94%E6%B6%88%E6%81%AF)

### 发送图片新闻

```
res.reply([
  {
    title: 'Nodejs微信开发',
    description: 'by StuQ 桑世龙',
    picurl: 'http://images.51cto.com/files/uploadimg/20111110/1113010.png',
    url: 'https://cnodejs.org/'
  }
]);
```


上传mp3，需要wechat-api上传

uploadMPVideo
将通过上传下载多媒体文件得到的视频media_id变成视频素材

## 等待回复

https://github.com/expressjs/session

```
npm install express-session
```

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))


var List = require('wechat').List;
List.add('view', [
  ['回复{a}查看我的性别', function (info, req, res) {
    res.reply('我是个妹纸哟');
  }],
  ['回复{b}查看我的年龄', function (info, req, res) {
    res.reply('我今年18岁');
  }],
  ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
]);

