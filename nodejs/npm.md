# 编写Nodejs模块？

nodejs的出现，可以算是前端里程碑式的一个事件，它让前端攻城狮们摆脱了浏览器的束缚，踏上了一个更加宽广的舞台。前端的可能性，从此更加具有想象空间。

随着一系列基于nodes的应用/工具的出现，工作中与nodejs打交道的机会越来越多。无论在node应用的开发，还是使用中，包管理都扮演着一个很重要的作用。NPM（node package manager），作为node的包管理工具，极大地便利了我们的开发工作，很有必要了解一下。

## 什么是Npm？

https://www.npmjs.com/

npm is the package manager for
  - browsers
  - javascript
  - nodejs
  - io.js
  - mobile
  - bower
  - docpad
  - test

简单理解：NPM（node package manager），通常称为node包管理器。顾名思义，它的主要功能就是管理node包，包括：安装、卸载、更新、查看、搜索、发布等。

它可不只是nodejs package manager，可见其定位是很广的，这从侧面也佐证了大前端和node全栈的机会。

以前nodejs吹牛都是那异步说事儿，现在都是拿生态说事儿

这话不错，在09年谈异步，很多语言都很弱，但事情要以发展的眼光看，现在很多语言都支持了，而且性能还不错，所以才显得nodejs性能没那么突出

但是，nodejs的性能依然是很棒的

现在来说npm这事儿，它确实很牛逼

![](img/1.png)

- 共计230,792个包
- 昨日下载量46,065,663
- 上周下载量761,014,696
- 上月下载量2,729,222,496

是不是看着挺可观的？

npm官网： https://npmjs.org/

npm官方文档： https://npmjs.org/doc/README.html

我们需要了解什么

- npm的安装、卸载、升级、配置
- npm的使用：package的安装、卸载、升级、查看、搜索、发布
- npm包的安装模式：本地 vs 全局
- package.json：包描述信息
- package版本：常见版本声明形式
- 如何编写nodejs模块

## npm上面都有哪些包

下面我们再看看它上面都有哪些包

- browserify
browser-side require() the node way
10.2.6 published 7 months ago by substack

- grunt-cli
The grunt command line interface.
0.1.13 published 2 years ago by tkellen

- bower
The browser package manager
1.4.1 published 10 months ago by sheerun

- gulp
The streaming build system
3.9.0 published 8 months ago by phated

- grunt
The JavaScript Task Runner
0.4.5 published 2 years ago by cowboy

- express
Fast, unopinionated, minimalist web framework
4.13.1 published 7 months ago by dougwilson

- npm
a package manager for JavaScript
2.13.0 published 7 months ago by zkat

- cordova
Cordova command line interface tool
5.1.1 published 8 months ago by stevegill

- forever
A simple CLI tool for ensuring that a given node script runs continuously (i.e. forever)
0.14.2 published 7 months ago by indexzero

- less
Leaner CSS
2.5.1 published 8 months ago by agatronic

- pm2
Production process manager for Node.JS applications with a built-in load balancer.
0.14.3 published 7 months ago by jshkurti

- karma
Spectacular Test Runner for JavaScript.
0.13.1 published 6 months ago by dignifiedquire

- coffee-script
Unfancy JavaScript
1.9.3 published 8 months ago by jashkenas

- statsd
A simple, lightweight network daemon to collect metrics over UDP
0.7.2 published a year ago by pkhzzrd

- yo
CLI tool for running Yeoman generators
1.4.7 published 8 months ago by sindresorhus


可以说nodejs能做的所有的事儿基本上都有体现，所有著名的项目也都是以npm形式发布的。所以很大程度上讲，nodejs里的node module 和npm是一样的。

这就是生态，你想要什么，就去npmjs上搜一下，基本都会有，如果没有也没关系，js这么简单，自己写一个npm也是分分钟的事儿。（后面会讲哦）

不管你是做后台开发，还是开发前端工具，npm都是非常重要的。甚至作为sa（system admin）都需要会npm。

总结一下为啥必须学npm

- 开发简单
- 模块丰富
- 与c、c++等语言集成方便
- 干啥都用的到


我讲nodejs课的时候，总结安装nodejs的3m安装大法

- nvm  (Node version manager)
- npm （package manager for node, react, bower, angualr, ...）
- nrm （NPM registry manager）

其中npm和nrm都是关于npm的，可见其重要程度。


## nrm

下面内容在coding.com上演示

```
npm install -g nrm
```

```
nrm test
```

```
nrm use
```

```
nrm ls
```

## 当心npm版本

npm2和3是不一样的

3是扁平化管理，和2不是完全兼容，会有莫名其妙的一些问题

再有就是npm2.9之后才支持私有模块

再有就是使用nrm切换到其他源上，导致npm无法发布

# 如何编写Nodejs命令行模块？

脚手架的原理和生成代码都已经有了，可是如何在命令行工具里

上面给出的很多都是nodejs写的小工具模块，nodejs和npm的种种好处，使得nodejs开发命令行模块异常简单


先说一下node module的作用

- 封装常见类库
- 命令行工具

nodejs这几年之所以如此快的崛起，就是因为模块编写简单，npm无比强大

npm是nodejs最好的东西，常用分类

- 1）命令行工具
  - 比如express-generator
  - 比如gulp 和grunt
- 2）shell相关
  - 比如kp：根据端口杀死进程
  - 比如mongo-here：启动mongodb的简化写法
- 3）本地服务器
  - 比如je
  - 比如hade

用起来非常方便，虽然有在线的，但网络是一个障碍
尤其没网的时候就不能用，非常郁闷

具体做法

无论如何，它都值得你一学的

下面看一下如何编写nodejs命令行模块

## 创建git repo

github上创建即可

## git clone到本地

```
	git clone git@github.com:i5ting/node-cli-demo.git
```
##  切换到项目目录
```
	cd node-cli-demo
```
## 初始化npm

使用npm命令，初始化npm的配置文件package.json


执行

```
npm init
```

一直回车，除非你真的有东西想改动，具体如下

```
➜  node-cli-demo git:(master) npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sane defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (node-cli-demo)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository: (https://github.com/i5ting/node-cli-demo.git)
keywords:
author:
license: (ISC)
About to write to /Users/sang/workspace/github/node-cli-demo/package.json:

{
  "name": "node-cli-demo",
  "version": "1.0.0",
  "description": "node-cli-demo =============",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/i5ting/node-cli-demo.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/i5ting/node-cli-demo/issues"
  },
  "homepage": "https://github.com/i5ting/node-cli-demo"
}


Is this ok? (yes)
➜  node-cli-demo git:(master) ✗
```

## 创建文件

```
	mkdir bin
	mkdir test

	touch bin/node-cli-demo.js
	touch test/node-cli-demo.js

	touch index.js
	touch gulpfile.js
```

bin是可执行文件

test是放测试文件的目录

lib是模块的核心代码目录，一般是index.js找lib/xxx.js


```
 #!/usr/bin/env node

 console.log('hello node module')
```

## 修改package.json

### 命令配置（至关重要）

```
  "preferGlobal": "true",
  "bin": {
    "badge": "bin/badge.js"
  },
```

此处是关键

`preferGlobal`确定你的这个命令是不是全局的，一定要设置为true，不然不放到path里，不能全局用的。


`bin`是配置你的cli名称和具体哪个文件来执行这个的

### scripts

```
  "scripts": {
    "start": "npm publish .",
    "test": " node bin/badge.js -t js -n q "
  },
```

这里定义了2个命令

- `npm start`

这里我用它发布当前npm到npmjs.org上

- `npm test`

这里我用它作为测试代码，避免每次都重复输入

## 发布

发布之前要注册npmjs账户的

```
  npm login(只需要一次，以后就不用了)
	npm start
```

当然更多的时候，我们看到的命令是这样

```
➜  vsc-doc git:(master) ✗ cp --help
cp: illegal option -- -
usage: cp [-R [-H | -L | -P]] [-fi | -n] [-apvX] source_file target_file
       cp [-R [-H | -L | -P]] [
```

## 更多

推荐几个解析命令行args的库

- commander是tj写的，一个不错的库，目前用的最多的库
- yargs也不错，更强大，简洁，官方推荐
- ccli是我写的，封装了yargs和基本常用的库（还不完善，凑合用）

还有私有模块

