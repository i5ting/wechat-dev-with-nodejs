# 公众号支付（JSAPI）


### out_trade_no生成

```
function _get_date_string () {
  var date = moment().format('YYYY MM DD HH mm ss');

  return date.split(' ').join('_');
}

function _get_out_trade_no () {
  return _get_date_string ()  + "" + Math.random().toString().substr(2, 10);
}
```


测试方法

```
function pay_h5(){
  var ordor_id = _get_out_trade_no ();
  alert(ordor_id)
  $.get('/wechats/pay_h5?id=o12hcuKXjejDFUwxMgToaGtjtqf4&order_id=' + ordor_id + '&body=1111&detail=222222&fee=1&cb_url=/wechats/pay_calllback/'+ ordor_id, function(data){
    var r = data.data;

    WeixinJSBridge.invoke('getBrandWCPayRequest', r, function(res){
      if(res.err_msg == "get_brand_wcpay_request:ok"){
        alert("支付成功");
        // 这里可以跳转到订单完成页面向用户展示
      }else{
        alert("支付失败，请重试");
      }
    });
  });
}
```

### 本地测试

### 对账单接口

#### 支付成功的回调

```
wxpay.createUnifiedOrder({
    body: '扫码支付测试',
    out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
    total_fee: 1,
    spbill_create_ip: '192.168.2.210',
    notify_url: 'http://wxpay_notify_url',
    trade_type: 'NATIVE',
    product_id: '1234567890'
}, function(err, result){
    console.log(result);
});
```

#### 支付结果异步通知

```
商户服务端处理微信的回调（express为例）

// 原生支付回调
router.use('/wxpay/native/callback', wxpay.useWXCallback(function(msg, req, res, next){
    // msg: 微信回调发送的数据
}));

// 支付结果异步通知
router.use('/wxpay/notify', wxpay.useWXCallback(function(msg, req, res, next){
    // 处理商户业务逻辑

    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    res.success();
}));
```

#### 手动对账单

查询订单

```
// 通过微信订单号查
wxpay.queryOrder({ transaction_id:"xxxxxx" }, function(err, order){
    console.log(order);
});

// 通过商户订单号查
wxpay.queryOrder({ out_trade_no:"xxxxxx" }, function(err, order){
    console.log(order);
});
```
