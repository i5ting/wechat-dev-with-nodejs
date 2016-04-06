# 技术选型

- nodejs
- mongodb
- h5
- 前后端分离

## 前后端分离

- 前端
  - public下面的采用nginx做反向代理
  - 其他的采用express+jade精简代码（ajax与后端交互）
- 后端json api

实例https://github.com/moajs/moa-frontend/blob/master/config/nginx.example.conf

```
server {
    listen       8000;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    location / {
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
  	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
  	    proxy_set_header X-NginX-Proxy true;
  	    proxy_pass http://127.0.0.1:3010;
        proxy_redirect off;
    }
    # Load configuration files for the default server block.
    # include /etc/nginx/default.d/*.conf;
    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    location /api {
        proxy_set_header X-Real-IP $remote_addr;
  	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
  	    proxy_set_header X-NginX-Proxy true;
  	    proxy_pass http://127.0.0.1:3005;
        proxy_redirect off;
    }
}
```

注意

- listen       8000;  （nginx端口8000）
- location /          （前端端口3010）
- location /api       （后端端口3005）

## 后端api

- express（koa、或base2也可以）
- res.api
- mount-routes
- mongoose
- 微信授权https://github.com/node-webot/wechat-oauth
- 微信支付https://github.com/tvrcgo/weixin-pay

## 前端h5

- zepto
- weui
- iscroll
- fastclick
- swiper

## 高级h5

- vux
- jmui
