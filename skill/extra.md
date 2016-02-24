# extra practice

## 使用oh-my-zsh

- 官网 http://ohmyz.sh/
- 代码 https://github.com/robbyrussell/oh-my-zsh

安装步骤

- 先安装zsh
- 安装oh-my-zsh

以后环境变量在~/.zshrc里

## alias

俗称别名，是一个linux命令

举例：在git里面我们最常用的命令是查看状态，可以又太长

于是

```
vi ~/.zshrc
```

增加如下别名定义

```
alias gs='git status'
```

source使环境变量生效（如果不想重启电脑的话）

```
source ~/.zshrc
```
如果不理解环境变量，自己去闭门思过去

它的作用是让长命令变短

有个经典说法：“演进就应该像女生的裙子”

## 杀死所有nodejs相关进程

天天写nodejs的都有这个痛苦，起了太多实例，分不清哪个是哪个

索性都干掉吧

```
ps -ef|grep node|awk '{print $2}'|xargs kill -9
```

这是非常经典的一条命令

说明

- ps -ef查看进程
- grep node是过滤进程里的和node相关的所有进程
- awk '{print $2}' 取出进程号
- xargs kill -9 杀掉该进程

`|`是pipe，即管道的意思：上一个的输出，是下一个的输入

nodejs里stream和pipe是一样的概念

如此理解变掌握了shell的精髓

“上一个的输出，是下一个的输入，组合着用”

每一个命令把它写到极致

这是unix的哲学

## 命令行查找代码

ack是一个perl脚本，是grep的一个可选替换品。其可以对匹配字符有高亮显示。是为程序员专门设计的，默认递归搜索，省提供多种文件类型供选。

http://beyondgrep.com/install/


Ubuntu

- Package "ack-grep"

Mac

- brew install ack

mac下面直接用，linux记得自己alias一下

检索文本内的key是非常高效的

```
➜  vsc-doc git:(master) ✗ ack i5ting
extra.md
72:https://github.com/i5ting/awesome-mac-practice2/blob/master/app/Dash.zip?raw=true

preview/index.html
434:<li><a href="http://i5ting.github.io/nodejs-video/node-inspector.mov">node-inspector视频</a></li>
435:<li><a href="http://i5ting.github.io/nodejs-video/node-debug.mov">node-debug视频</a></li>
525:<p>这其实和<a href="http://i5ting.github.io/How-to-write-jQuery-plugin/build/jquery.plugin.html#10501">jquery插件里的配置项</a>原理是类似的</p>
1307:<p>详见 http://i5ting.github.io/vsc-course/ </p>

preview/README.html
434:<li><a href="http://i5ting.github.io/nodejs-video/node-inspector.mov">node-inspector视频</a></li>
435:<li><a href="http://i5ting.github.io/nodejs-video/node-debug.mov">node-debug视频</a></li>
525:<p>这其实和<a href="http://i5ting.github.io/How-to-write-jQuery-plugin/build/jquery.plugin.html#10501">jquery插件里的配置项</a>原理是类似的</p>
1307:<p>详见 http://i5ting.github.io/vsc-course/ </p>

preview/toc/js/ztree_toc.js
2:* https://github.com/i5ting/jQuery.zTree_Toc.js

README.md
313:- [node-inspector视频](http://i5ting.github.io/nodejs-video/node-inspector.mov)
314:- [node-debug视频](http://i5ting.github.io/nodejs-video/node-debug.mov)
427:这其实和[jquery插件里的配置项](http://i5ting.github.io/How-to-write-jQuery-plugin/build/jquery.plugin.html#10501)原理是类似的
1266:详见 http://i5ting.github.io/vsc-course/
```
这其实就是全文检索

其实go写的[fzf](https://github.com/junegunn/fzf)也很棒

这个命令非常非常常用，尤其是阅读源码，或者特别复杂的项目里

##  查询文档神器

- http://zealdocs.org/ (推荐，离线下载)

有很多doc在[dash](https://github.com/i5ting/awesome-mac-practice2/blob/master/app/Dash.zip?raw=true
)（mac）里默认是没有的；

see here ： http://kapeli.com/docset_links

如果是下载到本地的docset，放到zealdocs目录下面，需要重启zeal

- linux 叫zeal
- mac 叫dash

都是基于docset的神器

本地文档的好处是，尽量少依赖网络，没有网也能干活，这是本事

培养自己的独立思考能力，而不是acv的庸才

## 目录切换神器

autojump是一个命令行工具，它允许你可以直接跳转到你喜爱的目录，而不用管你现在身在何处。

https://github.com/wting/autojump

Linux

    sudo apt-get install autojump

Mac os

    brew install autojump

需要修改~/.zshrc里的plugin,修改为

    plugins=(git autojump)

然后

    source ~/.zshrc

至此，已经完成了安装。

此后cd到任意目录，以后就可以使用j这个直达到某个目录了，下面是示例：

    ➜  nodejs-newbie git:(master) ✗ cd ~/workspace/github/nodejs-newbie
    ➜  nodejs-newbie git:(master) ✗ cd ~
    ➜  ~  j nodejs-n
    /Users/sang/workspace/github/nodejs-newbie
    ➜  nodejs-newbie git:(master) ✗

这样就会跳到上一次cd进去的目录，是不是非常方便？

我本地有非常多的github上的项目，彼此依赖，就采用这种方式切换，省了不少脑细胞

如果想玩的更high，可以参见https://github.com/clvv/fasd

## 根据端口号查看进程

nodejs写web程序，都要起一个端口，反复打开，关闭，就难免有僵尸进程，怎么也杀不掉

只知道端口如何查看进程呢？

lsof是系统管理/安全的工具，列出打开文件（lists openfiles）

```
$ lsof -i:3005
COMMAND   PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    30438 sang   26u  IPv6 0xd9428cd06d17f6af      0t0  TCP *:geniuslm (LISTEN
```

3005是端口号

于是衍生一下，根据端口杀进程，比如express默认是3000端口，难免有时有僵尸进程，如果直接根据端口杀死，是不是很爽？

```
lsof -i:3005|xargs killall
```

全干掉，想不死都不行

再衍生一下，能不能封装成一个nodejs模块，端口号作为参数，完成上述功能呢？

于是有了kp

kp is a tool for kill process by server port

我写的一个模块，上面就是原理，下面说一下用法

    [sudo]npm install -g kp
    kp 3002

https://github.com/i5ting/kp

是不是简单实用呢？

## mongodb客户端

推荐 www.robomongo.org

- 支持win
- 支持linux
- 支持mac（mac10.10下中文乱码，需要robomongo v0.8.5+）

这个是最好用的，但是每次启动都比较麻烦

- mac下面使用quicksilver或spotlit
- linux使用alias rogo='robomongo'

别名alias，有用吧，得学会偷懒

## 使用node-inspector调试Node代码

上面讲了vsc调试nodejs，可是如果你想了解更深的原理

看我写的三法三例调试教程

https://cnodejs.org/topic/5463f6e872f405c829029f7e

## 使用mongoose-cli数据库建模

随时随地，测试model，融合bluebird等promise库，让业务处理更简单

https://cnodejs.org/topic/55c44f0db98f51142b367b54

## mongo here

如果你同时有多个项目，它们有不同的mongodb，你会哭的，而且又是启动有特别容易出问题

mongo here就是解决这个问题的

当前目录启动mongodb

在新建目录执行

    mh

它会创建tmp目录，然后日志，数据都放到tmp里。


全局启动mongodb

    mhg

它会创建~/mongo/目录，当前用户下起mongo服务，即用户下全局共享

https://github.com/i5ting/mongo-here

核心原理很简单,写个shell脚本，执行命令mh的时候执行它就好了

```
#! /bin/bash

mkdir -p tmp/db
mkdir -p tmp/pids
mkdir -p tmp/logs


# remove lock file
[ -f tmp/db/mongod.lock ] && rm -rf tmp/db/mongod.lock

touch tmp/pids/mongodb.pid

# mongod --bind_ip 192.168.1.100 --port 27017 --dbpath tmp/db --logpath tmp/logs/mongodb.log --pidfilepath tmp/pids/mongodb.pid
nohup mongod --bind_ip 127.0.0.1 --port 27017 --dbpath tmp/db --logpath tmp/logs/mongodb.log --pidfilepath tmp/pids/mongodb.pid >mongod.log 2>&1 &
```
此处是在当前目录下面建立tmp目录，所以保证了权限等问题

mhg其实更简单，就是在用户主目录`~`下建

懂shell就是好，可以干很多坏事儿，是不是？

## json editor

我平常经常api，大部分api都是返回json字符串，结构看起来特别恶心

那能不能可视化呢？

    [sudo] npm install -g je
    je

详见https://github.com/i5ting/je

## nodejs里的csv处理

    [sudo] npm install -g j2csv
    json2csv

详见https://github.com/i5ting/json2csv

上面给出的方案适合3000条以内的数据，受限于浏览器

更大量的数据，需要

    [sudo] npm install -g ej
    ej input.json output.csv

https://github.com/i5ting/ej

很多时候，实现导入导出，见

https://github.com/i5ting/i-csv

## upload-cli

服务器上有些上传、删除的工作，ssh进去之后，操作太麻烦了

于是写了upload-cli ：a node cli tools for uploads ui

https://github.com/i5ting/upload-cli

- 目前已经支持通过命令行`uci`上传，可指定host

## 编写markdown文档

大部分人都有的需求

- 生成markdown模块
- markdown编译成html
- 支持table of content
- 能够push到git pages上

为了markdown toc，我写了https://github.com/i5ting/i5ting_ztree_toc

然后写了一个nodejs模块https://github.com/i5ting/tocmd.npm，用于编译markdown，按照toc模板编译

当然，每次发布到gitpages，我很不爽，于是使用gulp里的`gulp-gh-pages`直接自动化

最后我想更懒点

于是就有了https://github.com/i5ting/docto

一条命令全部搞定
