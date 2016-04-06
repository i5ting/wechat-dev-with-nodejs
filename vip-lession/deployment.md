# 部署

## 采用云服务器

比如阿里云，coding其实也可以凑合着用

- server
- db
- slb
- 监控


推荐ubuntu 14.10 LTS

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

##  阿里云服务器挂载数据硬盘

  购买普通阿里云服务器的时候，本机默认自带的系统盘大小为20G，但是这样的大小是不满足部署产品服务器的需求，
  所以可以购买阿里云数据盘，一半大小为200G

- 首先使用root用户查看系统版本，本文是在centos中部署使用

  在终端中使用下面命令查看系统版本

```
$ lsb_release -a

LSB Version:  :core-4.1-amd64:core-4.1-noarch
Distributor ID: CentOS
Description:  CentOS Linux release 7.2.1511 (Core)
Release:  7.2.1511
Codename: Core
```

确定系统版本之后在终端中确认系统盘情况(注：使用root用户):

```
$ fdisk -l

Disk /dev/xvda: 21.5 GB, 21474836480 bytes, 41943040 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x0009e68a

    Device Boot      Start         End      Blocks   Id  System
/dev/xvda1   *        2048    41943039    20970496   83  Linux

Disk /dev/xvdb: 214.7 GB, 214748364800 bytes, 419430400 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0xd0c73cf7

    Device Boot      Start         End      Blocks   Id  System
/dev/xvdb1            2048   419430399   209714176   83  Linux
```

首先确认在阿里云中购买了数据盘，上面的Disk /dev/xvda是自带的系统盘，/dev/xvda1表示已经挂载并且在使用中，Disk /dev/xvdb是数据盘，
上面的情况是已经挂载好的，如果没有挂载情况，只显示Disk /dev/xvdb: 214.7 GB, 214748364800 bytes, 419430400 sectors，表示未被
使用

- 将未被分区挂载的数据盘进行分区挂载

```
$ fdisk  /dev/xvdb
```
根据提示，输入"n","p","1",两次回车,"wq",分区开始，很快就会结束

- 查看新的分区：

```
$ fdisk -l
```
此时应该显示/dev/xvdb已被分区, like this:

```
Device                Boot      Start         End      Blocks   Id  System
/dev/xvdb1            2048   419430399   209714176              83  Linux
```
- 格式化新的分区

以ext3为例：使用“mkfs.ext3 /dev/xvdb1”命令对新分区进行格式化，格式化的时间根据硬盘大小有所不同。
(也可自主决定选用其它文件格式，如ext4等)

```
$ mkfs.ext3 /dev/xvdb1
```
需要等一段时间等待格式化完毕

- 添加新的分区信息

```
$ echo '/dev/xvdb1  /mnt ext3    defaults    0  0' >> /etc/fstab
```
- 查看分区

```
$ cat /etc/fstab
```
出现/dev/xvdb1  /mnt ext3    defaults    0  0 说明成功

- 挂载新的分区

```
$ mount -a
```

- 查看分区的情况

```
$ df -h

Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/xvda1      20510332 2031552  17413872  11% /
devtmpfs          934320       0    934320   0% /dev
tmpfs             942004       0    942004   0% /dev/shm
tmpfs             942004   98724    843280  11% /run
tmpfs             942004       0    942004   0% /sys/fs/cgroup
/dev/xvdb1     206292664 1065720 194724852   1% /mnt
```
/dev/xvdb1已经成功启用，挂载成功


## pm2

https://github.com/Unitech/pm2


```
$ npm install pm2 -g            # Install PM2
$ pm2 start app.js              # Start, Daemonize and auto restart application
$ pm2 start app.js -i 4         # Start 4 instances of application in cluster mode
                                # it will load balance network queries to each app
$ pm2 start app.js --name="api" # Start application and name it "api"
$ pm2 start app.js --watch      # Restart application on file change
$ pm2 start script.sh           # Start bash script

$ pm2 list                      # List all processes started with PM2
$ pm2 monit                     # Display memory and cpu usage of each app
$ pm2 show [app-name]           # Show all informations about application

$ pm2 logs                      # Display logs of all apps
$ pm2 logs [app-name]           # Display logs for a specific app
$ pm2 flush

$ pm2 stop all                  # Stop all apps
$ pm2 stop 0                    # Stop process with id 0
$ pm2 restart all               # Restart all apps
$ pm2 reload all                # Reload all apps in cluster mode
$ pm2 gracefulReload all        # Graceful reload all apps in cluster mode
$ pm2 delete all                # Kill and delete all apps
$ pm2 delete 0                  # Delete app with id 0
$ pm2 scale api 10              # Scale app with name api to 10 instances
$ pm2 reset [app-name]          # Reset number of restart for [app-name]

$ pm2 startup                   # Generate a startup script to respawn PM2 on boot
$ pm2 save                      # Save current process list
$ pm2 resurrect                 # Restore previously save processes
$ pm2 update                    # Save processes, kill PM2 and restore processes
$ pm2 generate                  # Generate a sample json configuration file

$ pm2 deploy app.json prod setup    # Setup "prod" remote server
$ pm2 deploy app.json prod          # Update "prod" remote server
$ pm2 deploy app.json prod revert 2 # Revert "prod" remove server by 2

$ pm2 module:generate [name]    # Generate sample module with name [name]
$ pm2 install pm2-logrotate     # Install module (here a log rotation system)
$ pm2 uninstall pm2-logrotate   # Uninstall module
$ pm2 publish                   # Increment version, git push and npm publish
```



pm2 是一个带有负载均衡功能的Node应用的进程管理器.
当你要把你的独立代码利用全部的服务器上的所有CPU，并保证进程永远都活着，0秒的重载， PM2是完美的。
可以感受一下[官方的部署文档示例](http://pm2.keymetrics.io/docs/usage/deployment/)，
[github项目地址](https://github.com/Unitech/pm2)。


主要的特点:

- 内建负载均衡（使用Node cluster 集群模块）
- 后台运行
- 0秒停机重载，我理解大概意思是维护升级的时候不需要停机.
- 具有Ubuntu和CentOS 的启动脚本
- 停止不稳定的进程（避免无限循环）
- 控制台检测
- 提供 HTTP API
- 远程控制和实时的接口API ( Nodejs 模块,允许和PM2进程管理器交互 )

## pm2部署简单应用

### 安装pm2

```
npm install -g pm2
```

### 使用pm2部署简单的项目

```
$ pm2 start app.js --name "heheda" -i 0 --watch
```

- pm2 start app.js : 使用pm2启动app.js

- -i 0 : 使用最大进程数启动

- --name : 指定一个你喜欢的名字

- --watch : 开启监视模式，如果代码有变动pm2自动重启

### 查看pm2部署

```
pm2 ls
```

## pm2自动部署远程服务器

目前我们部署服务器的方式是使用oschina托管项目，然后在服务器中安装git将项目克隆到服务器中，然后
使用pm2部署项目，如果项目有任何的修改，就会需要跑到几个服务器中pull代码，然后pm2 reload项目，
蛋疼的要死。
现在就使用pm2的远程部署方式，解决这个蛋疼的问题！

### 准备工作

#### 将本地机器和线上服务器建立ssh信任，免密码登陆

- 生成git ssh公钥(本地机器和服务器操作一样)

```
$ git config --global user.name "heheda"
$ git config --global user.email "heheda@mail.com"
$ ssh-keygen -t rsa -C "heheda@mail.com"
```
连续三次回车,这样生成的ssh公钥添加到github


- 查看生成的ssh公钥

```
$ ls ~/.ssh/
authorized_keys id_rsa          id_rsa.pub      known_hosts
```

理论上已经生成ssh公钥,在用户主目录下的.ssh中生成的id_rsa.pub就是生成的公钥
authorized_keys文件是通过授权的ssh公钥，在使用ssh协议进行远程访问的时候，如果该机器的ssh公钥在
这个文件中，那么能直接进行访问

-  将ssh公钥拷贝到服务器

```
$ scp ~/.ssh/id_rsa.pub username@ip:用户主目录/.ssh/authorized_keys
```
执行这个命令是将本地的id_rsa.pub拷贝到服务器的.ssh／目录下并命名为authorized_keys
这样就能不需要密码访问远程服务器了
上一步已经将服务器的ssh公钥添加到 github 中了，这样服务器中clone项目也不需要密码

### pm2配置文件ecosystem.json

- [官方的部署文档示例](http://pm2.keymetrics.io/docs/usage/deployment/)

```
{
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  "deploy" : {
    "yourprojectname" : {
      "user" : "node",
      "host" : ["ip"],
      "ref"  : "origin/master",
      "repo" : "git.oschina.net",
      "path" : "/your/deploy/folder/",
      "post-deploy" : "npm install ; pm2 start bin/www --name 'hz-frontend' --watch",
      "env"  : {
        "NODE_ENV": "dev"
      }
    }
  }
}
```

- user : 你登陆到远程主机的用户名
- host : 服务器的ip地址
- ref : 部署的分支
- repo : github或oschina中托管的地址
- path : 部署到服务器的目录
- post-deploy : 部署时的命令

###  执行部署

- 首次在服务器中部署（服务器中没有需要部署的项目，需要将代码克隆到服务器）

```
pm2 deploy ecosystem.json yourprojectname setup
```
上面命令是将项目从github或oschina中克隆到指定path中，需要注意一下的是，pm2 将目录结构分为 :

|current | shared  |source |

- 克隆好之后执行安装和启动

```
pm2 deploy ecosystem.json yourprojectname
```

官方推荐在部署的项目中也使用ecosystem.json进行启动项目 ：

```
{
  "apps" : [{
    // Application #1
    "name"        : "hz-mq",
    "script"      : "index.js",
    "args"        : "--toto=heya coco -d 1",
    "watch"       : true,
    "node_args"   : "--harmony",
    "merge_logs"  : true,
    "cwd"         : "/Users/zxy/work/hz-mq",
    "env": {
      "NODE_ENV": "development",
      "AWESOME_SERVICE_API_TOKEN": "xxx"
    },
    "env_production" : {
       "NODE_ENV": "production"
    },
    "env_staging" : {
       "NODE_ENV" : "staging",
       "TEST"     : true
    },
    "exec_mode"  : "cluster_mode"
  }]
}
```

这个相对来说就简单了，就不一一说。
没有使用的原因是放在项目中在本地和服务器中使用需要来回修改启动目录。


