# 调试


## 本地调试

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
