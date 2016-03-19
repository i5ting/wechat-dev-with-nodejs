# 支付概述

https://pay.weixin.qq.com/wiki/doc/api/index.html


## 支付模式

1、
刷卡支付
刷卡支付是用户展示微信钱包内的“刷卡条码/二维码”给商户系统扫描后直接完成支付的模式。主要应用线下面对面收银的场景。

2、
扫码支付
扫码支付是商户系统按微信支付协议生成支付二维码，用户再用微信“扫一扫”完成支付的模式。该模式适用于PC网站支付、实体店单品或订单支付、媒体广告支付等场景。

3、
公众号支付
公众号支付是用户在微信中打开商户的H5页面，商户在H5页面通过调用微信支付提供的JSAPI接口调起微信支付模块完成支付。应用场景有：

- 用户在微信公众账号内进入商家公众号，打开某个主页面，完成支付
- 用户的好友在朋友圈、聊天窗口等分享商家页面连接，用户点击链接打开商家页面，完成支付
- 将商户页面转换成二维码，用户扫描二维码后在微信浏览器中打开页面后完成支付

4、
APP支付
APP支付又称移动端支付，是商户通过在移动端应用APP中集成开放SDK调起微信支付模块完成支付的模式。

## 原生支付 (NATIVE)

模式一

提供一个生成支付二维码链接的函数，把url生成二维码给用户扫。


后台需要设置

```
扫码支付->支付回调URL
```

模式二

直接调用 createUnifiedOrder() 函数生成预支付交易单，将结果中的 code_url 生成二维码给用户扫。


一帮

## 公众号支付 (JS API)

生成JS API支付参数，发给页面

## 名词

https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=2_2

## 文档

http://mp.weixin.qq.com/htmledition/res/bussiness-faq/wx_mp_pay.zip


## nodejs下面的实现

- https://github.com/tvrcgo/weixin-pay
- https://github.com/node-weixin/node-weixin-pay
- https://github.com/supersheep/wechat-pay（朴灵推荐）
