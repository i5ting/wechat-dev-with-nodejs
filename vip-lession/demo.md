# demo

- 部署服务器
- 代码解读
    - node的代码
        - 模型
        - 测试
        - api
    - 前端weui代码
        - index.html
        - example.js
        - 实现tab
        - 绑定实践
- 微信配置说明
- 总结

## 部署服务器


ubuntu 14.10 LTS  64位

## 登录远端服务器

ssh root@ip

## 创建用户

```
  # sudo useradd -m -d /home/sang -s /bin/bash -c "the sang user" -U sang
  # passwd sang
  Enter new UNIX password:
  Retype new UNIX password:
  passwd: password updated successfully
```

- useradd创建登录用户
- passwd设置用户登录密码

## 赋予sudo权限

如果有必要使用sudu权限，请修改

```
  # sudo vi /etc/sudoers
```

复制root行改为sang即可

```
  # User privilege specification
  root	ALL=(ALL:ALL) ALL
  sang	ALL=(ALL:ALL) ALL
```
## 切换用户

```
  # su - sang
  $ ls
  $
  $ pwd
  /home/sang
  $
```

## 安装必备软件

### 安装git

如果上面没有复制给sang账户sudo权限，请切换到root账户操作

```
sudo apt-get update
sudo apt-get install git
```

### 安装nginx

```
sudo apt-get install nginx
```

开机启动（http://www.jianshu.com/p/2e03255cfabb）

```
sudo apt-get install sysv-rc-conf
sudo sysv-rc-conf nginx on
```

### 准备工作目录

```
mkdir -p workspace/github
cd workspace/github
```

## 安装nodejs

### 安装nvm

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  7766  100  7766    0     0  28614      0 --:--:-- --:--:-- --:--:-- 28656
=> Downloading nvm as script to '/home/sang/.nvm'

=> Appending source string to /home/sang/.bashrc
=> Close and reopen your terminal to start using nvm
$ source ~/.bashrc
$ nvm

Node Version Manager
```

安装nodejs lts版本

```
$ nvm install 4
Downloading https://nodejs.org/dist/v4.3.2/node-v4.3.2-linux-x64.tar.xz...
######################################################################## 100.0%
Now using node v4.3.2 (npm v2.14.12)
Creating default alias: default -> 4 (-> v4.3.2)
$ node -v
v4.3.2
```

使之成为默认

```
$  nvm alias default 4.3
default -> 4.3 (-> v4.3.2)
```

### 确认npm版本

```
$ npm -v
2.14.12
```

只要大于2.9.1即可，如不是，请`npm i -g npm@2.9.1`

### 安装nrm

```
$ npm i -g nrm
npm WARN deprecated npmconf@0.1.16: this package has been reintegrated into npm and is now out of date with respect to npm
/home/sang/.nvm/versions/node/v4.3.2/bin/nrm -> /home/sang/.nvm/versions/node/v4.3.2/lib/node_modules/nrm/cli.js
nrm@0.3.0 /home/sang/.nvm/versions/node/v4.3.2/lib/node_modules/nrm
├── ini@1.3.4
├── only@0.0.2
├── extend@1.3.0
├── async@0.7.0
├── open@0.0.5
├── commander@2.9.0 (graceful-readlink@1.0.1)
├── npmconf@0.1.16 (inherits@2.0.1, osenv@0.0.3, ini@1.1.0, semver@2.3.2, mkdirp@0.3.5, once@1.3.3, nopt@2.2.1, config-chain@1.1.10)
├── node-echo@0.0.6 (jistype@0.0.3, mkdirp@0.3.5, coffee-script@1.7.1)
└── request@2.69.0 (aws-sign2@0.6.0, forever-agent@0.6.1, tunnel-agent@0.4.2, oauth-sign@0.8.1, is-typedarray@1.0.0, caseless@0.11.0, stringstream@0.0.5, isstream@0.1.2, json-stringify-safe@5.0.1, extend@3.0.0, tough-cookie@2.2.1, node-uuid@1.4.7, qs@6.0.2, combined-stream@1.0.5, form-data@1.0.0-rc3, mime-types@2.1.10, aws4@1.3.2, hawk@3.1.3, bl@1.0.3, http-signature@1.1.1, har-validator@2.0.6)
```

测速

```
$ nrm test

* npm ---- 274ms
  cnpm --- 6868ms
  taobao - 716ms
  edunpm - 5598ms
  eu ----- Fetch Error
  au ----- Fetch Error
  sl ----- 1234ms
  nj ----- 2228ms
  pt ----- Fetch Error
```

切换源

```
$ nrm use npm

   Registry has been set to: https://registry.npmjs.org/

```


## 部署nodejs应用

### 基础

- git clone
- npm i
- pm2 start


### 修改nginx

```
cat /etc/nginx/sites-enabled/default


upstream backend_nodejs {
    server 127.0.0.1:3019 max_fails=0 fail_timeout=10s;
    #server 127.0.0.1:3001;
    keepalive 512;
}


server {
	listen 80 default_server;
	listen [::]:80 default_server ipv6only=on;

	#root /usr/share/nginx/html;
	root /home/sang/workspace/oschina/base2-wechat-jssdk/public;
	index index.html index.htm;

	# Make site accessible from http://localhost/
        server_name nodeonly.mengxiaoban.cn at35.com;
	client_max_body_size 16M;
  	keepalive_timeout 10;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		#try_files $uri $uri/ =404;
		# Uncomment to enable naxsi on this location
		# include /etc/nginx/naxsi.rules

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_redirect off;
		proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
    proxy_set_header   Connection "";
    proxy_http_version 1.1;
    proxy_pass http://backend_nodejs;
	}
}
```

注意

- upstream backend_nodejs定义的代理转发的api地址
- location /下面的proxy_pass，从upstream里取
- root下面放的是静态资源，比如express下的public目录


然后重启nginx即可

```
sudo nginx -s reload
```


### 了解MONGODB的部署

- replset
- shard

我写的《 mongodb运维之副本集实践》

https://cnodejs.org/topic/5590adbbebf9c92d17e734de


on ubuntu

https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

## 代码部署

ssh免登陆

```
git clone git@git.oschina.net:i5ting/wechat-dev-with-nodejs.git
```

- 调整nginx
- pm2


## node的代码


### 模型

- 目录结构
- 表间关系

User用户

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

Course课程

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

订单

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

问题

- 如何查看我的课程？
- 如果查看我购买的课程？

### 测试

user

```
var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

require('../db')

var User = require('../app/models/user')

// 测试代码基本结构
describe('用户User', function(){
	before(function(d) {
    // runs before all tests in this block
    User.remove({"openid":"ss"},function(){
      d()
    })
  })
  after(function(){
    // runs after all tests in this block
    // User.remove({},function(err, user){
    // });
  })
  beforeEach(function(){
    // runs before each test in this block
  })
  afterEach(function(){
    // runs after each test in this block
  })

  describe('#save()', function(){
    this.timeout(30000);
    it('should return stuq when user save', function(done){
      User.create({"username":"stuq","password":"password", "openid":"ss"},function(err, user){
        if(err){
          console.log(err)
          expect(err).to.be.not.null;
          done();
        }

        expect(user.username).to.be.a('string');
        expect(user.username).to.equal('stuq');
        done();
      });
    })
  })
})
```

用户与课程

```
var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

require('../db')

var User = require('../app/models/user')
var Course = require('../app/models/course')
var Order = require('../app/models/order')

var _user;

// 测试代码基本结构
describe('课程Course', function(){
	before(function(done) {
    // runs before all tests in this block
    User.removeAsync({"username":"stuq","password":"password", "openid":"ss"}).then(function(){
      return User.createAsync({"username":"stuq","password":"password", "openid":"ss"})
    }).then(function(user){
      _user = user;
      return  Course.removeAsync({"name":"Node.js微信开发"});
    }).then(function(){
      done();
    });
  })
  after(function(){
    // runs after all tests in this block
    // User.remove({},function(err, user){
    // });
  })
  beforeEach(function(){
    // runs before each test in this block
  })
  afterEach(function(){
    // runs after each test in this block
  })

  describe('#save()', function(){
    it('should return Node.js微信开发 when Course save', function(done){
      Course.create({
        "name":"Node.js微信开发","desc":"stuq在线课程", "docent":"桑世龙", owner_id: _user._id,
        desc:"通过学习Node.js基础和express，微信开发常用库，h5，最后达到学会Node.js开发的目的，该课程以实战为主，深入浅出"
      },function(err, c){
        if(err){
          console.log(err)
          expect(err).to.be.not.null;
          done();
        }

        expect(c.name).to.be.a('string');
        expect(c.name).to.equal('Node.js微信开发');
        done();
      });
    })
  })
})
```

三个表相关的订单

```
var request = require('supertest');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
require('chai').should();

require('../db')

var User = require('../app/models/user')
var Order = require('../app/models/order')
var Course = require('../app/models/course')

var _user, _course;

// 测试代码基本结构
describe('订单Order', function(){
	before(function(done) {
    // runs before all tests in this block
    User.removeAsync({"openid":"ss1"}).then(function(){
      return  Course.removeAsync({"name":"Node.js微信开发1"});
    }).then(function(){
      User.create({"username":"stuq1","password":"password", "openid":"ss1"},function(err, user){
        _user = user;
        // console.log(err)
        // console.log(_user)
        return Course.create({"name":"Node.js微信开发1","desc":"stuq在线课程", "docent":"桑世龙", owner_id: _user._id},function(err1, c){
          // console.log(c)
          _course = c;

          done();
        });
      });
    })
  })
  after(function(){

  })
  beforeEach(function(){
    // runs before each test in this block
  })
  afterEach(function(){
    // runs after each test in this block
  })

  describe('#save()', function(){
    it('should return order when order save', function(done){
      Order.create({
        "desc":"a order"
        ,"user_id":_user._id
        , "user_name": _user.username
        ,course_id : _course._id
        ,course_name : _course.name
      },function(err, order){
        if(err){
          console.log(err)
          expect(err).to.be.not.null;
          done();
        }

        expect(order.desc).to.be.a('string');
        expect(order.desc).to.equal('a order');
        done();
      });
    })
  })
})
```

另外举例runkoa没有ci引发的血案

### api

自动挂载路由

```
var mount         = require('mount-routes');

// simple
mount(app, __dirname + '/app/routes');
```

示例

```
var express = require('express');
var router = express.Router();

var User = require('../../models/user')
var Course = require('../../models/course')
var Order = require('../../models/order')

router.get('/', function(req, res, next) {
  Course.find({},function(err, courses){
    res.json({
      status:{
        code:0,
        msg:'sucess'
      },
      data:courses
    });
  });
})

module.exports = router;
```

测试

```
curl http://127.0.0.1:3019/api/courses
```

或者`postman`

## 前端weui代码

weui v0.4.x新增了路由和tab等组件，问题还是挺多的

frontend目录随便配，目的就是为了让大家理解前后端分离

### 路由


定义骨架

```
    var router = new Router({
        container: '#container',
        enterTimeout: 250,
        leaveTimeout: 250
    });
```

然后

```

    // course
    var course = {
        url: '/course',
        className: 'panel',
        render: function () {
            // alert(getQueryStringByName('id'));
            return $('#tpl_course').html();
        },
        bind: function () {
            $('.pay_btn').on('click', function(){
              var id = getQueryStringByName('id');
              pay_h5(id);
            })
        }
    };

    // tabbar
    var tabbar = {
        url: '/home',
        className: 'tabbar',
        render: function () {
            var _t = this;
            setTimeout(function(){
              _t.bind()
            },100)
            return $('#tpl_tabbar').html();
        },
        bind: function () {
          $('.course_list').html(all_courses_html);
          $('.weui_tabbar_content').eq(0).show()
          $('.weui_tabbar_item').on('click', function () {
            $('.weui_tabbar_item').eq($('.weui_tabbar_item').index(this)).addClass('weui_bar_item_on').siblings().removeClass('weui_bar_item_on')
            $('.weui_tabbar_content').eq($('.weui_tabbar_item').index(this)).show().siblings().hide();
          });
        }
    };

    router.push(tabbar)
        .push(course)
        .setDefault('/home')
        .init();
```


### example.js

根据query的参数名，取值

```
function getQueryStringByName(name){
  var result = location.hash.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
  if(result == null || result.length < 1){
    return "";
  }
  return result[1];
}
```

ajax

```
var all_courses_html;
$.getJSON('/api/courses',function(res){
  // alert(res)
  var item_html = ""
  for(var i in res.data){
    console.log(i);
    var course = res.data[i];

    var item = "  <a href='#/course?id=" + course._id + "' class='weui_media_box weui_media_appmsg'>"
              +"    <div class='weui_media_hd'>"
              +"        <img class='weui_media_appmsg_thumb' src='" + course.pic + "' alt=''>"
              +"    </div>"
              +"    <div class='weui_media_bd'>"
              +"        <h4 class='weui_media_title'>" + course.name + "</h4>"
              +"        <p class='weui_media_desc'>" + course.desc + "</p>"
              +"    </div>"
              +"  </a>"

    item_html += item;
  }

  all_courses_html = "<div class='weui_panel_bd'> " + item_html + " </div><a class='weui_panel_ft' href='javascript:void(0);'>查看更多</a>"
  // alert(all);

  $('.course_list').html(all_courses_html);
})
```

这样首页是ok了，但是里面呢？

```
// tabbar
var tabbar = {
    url: '/home',
    className: 'tabbar',
    render: function () {
        var _t = this;
        setTimeout(function(){
          _t.bind()
        },100)
        return $('#tpl_tabbar').html();
    },
    bind: function () {
      $('.course_list').html(all_courses_html);
      $('.weui_tabbar_content').eq(0).show()
      $('.weui_tabbar_item').on('click', function () {
        $('.weui_tabbar_item').eq($('.weui_tabbar_item').index(this)).addClass('weui_bar_item_on').siblings().removeClass('weui_bar_item_on')
        $('.weui_tabbar_content').eq($('.weui_tabbar_item').index(this)).show().siblings().hide();
      });
    }
};
```

- setTimeout
- $('.course_list').html(all_courses_html);


### 实现tab

```
    <script type="text/html" id="tpl_tabbar">
        <div class="weui_tab">
            <div class="weui_tab_bd">
              <div class="weui_tabbar_content">
                <div class="hd">
                    <h1 class="page_title">StuQ课程</h1>
                    <p class="page_desc"> 提升你的IT职业技能最好的在线学习平台</p>
                </div>

                <div class="weui_panel weui_panel_access">
                    <div class="weui_panel_hd">课程列表</div>
                    <div class='course_list'></div>
                </div>

              </div>

              <div class="weui_tabbar_content">

              </div>

            </div>
            <div class="weui_tabbar">
                <a href="javascript:;" class="weui_tabbar_item">
                    <div class="weui_tabbar_icon">
                        <img src="./images/icon_nav_article.png" alt="">
                    </div>
                    <p class="weui_tabbar_label">课程</p>
                </a>
                <a href="javascript:;" class="weui_tabbar_item">
                    <div class="weui_tabbar_icon">
                        <img src="./images/icon_nav_cell.png" alt="">
                    </div>
                    <p class="weui_tabbar_label">我</p>
                </a>
            </div>
        </div>
    </script>
```

留意weui_tabbar_content


```
$('.weui_tabbar_content').eq(0).show()
$('.weui_tabbar_item').on('click', function () {
  $('.weui_tabbar_item').eq($('.weui_tabbar_item').index(this)).addClass('weui_bar_item_on').siblings().removeClass('weui_bar_item_on')
  $('.weui_tabbar_content').eq($('.weui_tabbar_item').index(this)).show().siblings().hide();
});
```

参见https://github.com/i5ting/i5ting.jquery.tab

###  绑定事件

- on
- live
- bind

## 微信配置说明

Stuq微信开发测试账号信息


### 公众平台

https://mp.weixin.qq.com/

- 微信名：StuQ课课程测试账号
- 微信账户：zhuohang111@163.com
- 密码：duanmu5061656


```
{
  "app_id": "wx1207227ce79d76c3",
  "app_secret": "b1693148b1b26318c9d8224a17ff0ee1"
}
```

### 微信支付

https://pay.weixin.qq.com


微信支付商户号    1299809901
商户平台登录帐号    1299809901@1299809901
商户平台登录密码    000090


安装操作证书

- 安装安全控件
- 安装操作证书（请事先联系海角，获取对应的短信验证码,输入短信验证码和验证码就自动安装完成了）

然后点击api安全


## 总结

### 关于StuQ

![](img/1.png)

软件公司招聘需要巨大，但入门难，技术发展过快（指数），而人的曲线成长较慢，现在的慕客形式又过于老旧，呆板，少互动，所以社群时代的在线教育，一定是专业的、互动的、深入浅出、共同成长，这些正是StuQ最擅长的方面，我个人特别看好StuQ这个品牌，真心推荐，如果不是股份绑定，我一定会加入StuQ

### 我的近况

- 新书《更了不起的 Node 4:将下一代 Web 框架 Koa 进行到底》
- StuQ-Koa在线课程

## 写给大家

- 少抱怨、多思考、未来更美好
- 闲时要有吃紧的心思
- 一万个小时就能成为专家，难在坚持
- 掌握了学习方法，以后职业不愁


