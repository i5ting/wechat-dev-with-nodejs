# 微信支付

## 科普几个概念

### app_id 和 app_secret

### 商户标识 mch_id

### p12文件

## 准备

### 安装操作证书

### 安装API证书

### 微信设置

- 公众号->微信支付->公众号支付->测试授权目录
- 公众号->开发者中心->网页服务->网页账号->网页授权获取用户基本信息

如果是产品模式，还要注意安全域名

测试授权目录说明

当前目录是 

- http://127.0.0.1:3000/contacts/new?activity_id=561cd060f96de2aee37f36b4

测试授权目录

- http://127.0.0.1:3000/contacts/


## weixin-pay

https://github.com/tvrcgo/weixin-pay

## 调试


推荐 https://localtunnel.me

特点：

- nodejs写的
- 稳定，速度也不错
- 可以指定域名，避免每次重启导致各种设置

```
npm install -g localtunnel
lt --port 3980 -s i5ting
```

记得在公众号里修改【网页授权获取用户基本信息】，为对应的req.wx.domain里对应的地址，否则无法测试的。

如果本地测试

- 在pay目录下放cert证书
- 配置好wechat_config.js
- 保证3个地址一样
  - req.wx.domain 
  - 测试授权目录
  - 网页授权获取用户基本信息
- 然后moas即可

有的时候lt会被防火墙拦截

```
$  lt --port 3980 -s i5ting
your url is: https://i5ting.localtunnel.me
events.js:141
      throw er; // Unhandled 'error' event
      ^

Error: connection refused: localtunnel.me:46628 (check your firewall settings)
    at Socket.<anonymous> (/Users/sang/.nvm/versions/node/v4.0.0/lib/node_modules/localtunnel/lib/TunnelCluster.js:47:32)
    at emitOne (events.js:77:13)
    at Socket.emit (events.js:169:7)
    at emitErrorNT (net.js:1250:8)
    at doNTCallback2 (node.js:429:9)
    at process._tickCallback (node.js:343:17)
```

这时候，暂时把防火墙关掉，效果还不错。

## 公众号支付（JSAPI）

### out_trade_no生成

### 本地测试

### 对账单接口

#### 支付成功的回调

#### 支付结果异步通知

#### 手动对账单

