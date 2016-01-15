# 数据统计

flurry，localytics，talkingdatada支持h5平台



## mta 腾讯云统计

http://mta.qq.com/mta/ctr_index/h5

腾讯云分析H5应用提供了以下统计功能。  
  
### 基础功能

实时数据、关键数据、运营商、客户端信息、访客画像、访客深度、地域信息、页面排行、外部链接、入口页面、离开页面等；如果您只需要基础功能，可以通过快速上手进行接入。

### 高级功能

AD-Tag细分、指定按钮统计；如果您要使用高级功能，可以查看下面的高级接入说明。

用法非常简单

### 用法：基本统计

- 登录
- 创建应用，选h5
- 创建成功后，返回app id和Secret key，以及一个script信息，放到你的html里即可

```
请安装在</head>标签前；
```
### 用法：AD-Tag细分

说白了就是渠道统计

分享H5链接时带上ADTAG参数，例如分享链接为www.qq.com/test.html，添加ADTAG后，为www.qq.com/test.html?ADTAG=a.b.c.d


### 用法：指定按钮统计

手码

```
onclick="MtaH5.clickStat('按钮标识')"
```

## DataEye统计平台

不好用

http://h5.dataeye.com/


## mixpanel


http://exp.freesvc.com/public/articles/13?from=timeline&isappinstalled=0