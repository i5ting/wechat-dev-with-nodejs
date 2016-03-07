# 分享

写一个具体实例

https://github.com/i5ting/wx_jsapi_sign

## 获取签名信息

```
app.post('/getsignature', function(req, res){
  var url = req.body.url;
  console.log(url);
  signature.getSignature(config)(url, function(error, result) {
        if (error) {
            res.json({
                'error': error
            });
        } else {
            res.json(result);
        }
    });
});
```


## 页面

```
<script src="jweixin-1.0.0.js"></script>
<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
<script>
// 使用 jq 动态加载 微信配置
$.ajax({
    url: '/getsignature' // 此处url请求地址需要替换成你自己实际项目中服务器数字签名服务地址
        ,
    type: 'post',
    data: {
        url: location.href.split('#')[0] // 将当前URL地址上传至服务器用于产生数字签名
    }
}).done(function(r) {
    // 返回了数字签名对象
    console.log(r);
    console.log(r.appid);
    console.log(r.timestamp);
    console.log(r.nonceStr);
    console.log(r.signature);
    // 开始配置微信JS-SDK
    wx.config({
        debug: true,
        appId: r.appId,
        timestamp: r.timestamp,
        nonceStr: r.nonceStr,
        signature: r.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'chooseImage'
        ]
    });
    // 调用微信API
    wx.ready(function() {
        var sdata = {
            title: '那年|测试微信分享及相关API',
            desc: '那年|测试微信分享及相关API',
            link: 'http://game.4gshu.com/deep-love/index2.html',
            imgUrl: 'http://game.4gshu.com/xuangedan/other-project/2015-01-06/img/share-wx-logo.jpg',
            success: function() {
                alert('用户确认分享后执行的回调函数');
            },
            cancel: function() {
                alert('用户取消分享后执行的回调函数');
            }
        };
        wx.onMenuShareTimeline(sdata);
        wx.onMenuShareAppMessage(sdata);
        // 添加图片
        $('#addPic').on('click', function() {
            wx.chooseImage({
                success: function(res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    // var imgs = localIds.split(',');
                    localIds.forEach(function(v, i) {
                        alert(v);
                        $('#picList').append('<li><img src="' + v + '" alt="" width="50"></li>');
                    });
                }
            });
        });
    });
});
```

## FAQ

1、如果微信公众号没有认证，无法自定义分享标题和图片；

见https://segmentfault.com/q/1010000002488298

2、填写域名




## 更多

- http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E8.8E.B7.E5.8F.96.E2.80.9C.E5.88.86.E4.BA.AB.E5.88.B0.E6.9C.8B.E5.8F.8B.E5.9C.88.E2.80.9D.E6.8C.89.E9.92.AE.E7.82.B9.E5.87.BB.E7.8A.B6.E6.80.81.E5.8F.8A.E8.87.AA.E5.AE.9A.E4.B9.89.E5.88.86.E4.BA.AB.E5.86.85.E5.AE.B9.E6.8E.A5.E5.8F.A3
- https://github.com/i5ting/wx_jsapi_sign/blob/master/test/public/demo.js
