# 支付概述

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


## 文档

http://mp.weixin.qq.com/htmledition/res/bussiness-faq/wx_mp_pay.zip 


## nodejs下面的实现

- https://github.com/tvrcgo/weixin-pay
- https://github.com/node-weixin/node-weixin-pay
- https://github.com/supersheep/wechat-pay（朴灵推荐）