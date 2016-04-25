# introduce

## 什么是nodejs

官方网站 https://nodejs.org/en/

Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.


- Node.js不是JS应用、而是JS运行平台(JavaScript runtime )
- 构建在Chrome's V8 JavaScript engine之上
- event-driven, non-blocking I/O model简单点讲就是每个函数都是异步的，所以lightweight and efficient
- 使用npm作为包管理生态，目前是开源库里包管理最大的生态，开源可用的库非常多


## 它能干什么？

- 网站（如express/koa等）
- im即时聊天(socket.io)
- api（移动端，pc，h5）
- http proxy（淘宝首页）
- 前端构建工具(grunt/gulp/bower/webpack/fis3...)
- 写操作系统（NodeOS）
- 跨平台打包工具（以前叫Node-WebKit现在叫nw.js,electron）
- 命令行工具（比如cordova）
- 编辑器（atom，vscode）

更多的见
https://github.com/sindresorhus/awesome-nodejs


http://stackshare.io/nodejs/in-stacks

## WHY NODEJS

- 前端熟悉的语言，學習成本低
- 都是JS，可以前后端复用
- 体质适合：事件驱动、非阻塞I/O
- 适合IO密集型业务
- 执行速度也不差
- 模块丰富，npm非常庞大、强大

## 什么是npm

NPM的全称是Node Package Manager[1]  ，是一个NodeJS包管理和分发工具，已经成为了非官方的发布Node模块（包）的标准，通常称为node包管理器。顾名思义，它的主要功能就是管理node包，包括：安装、卸载、更新、查看、搜索、发布等。

NPM作为Node的模块管理和发布工具，作用与Ruby的gem、Python的pypl或setuptools、PHP的pear和.Net的Nuget一样。在当前前端工程化极速狂奔的年代，即使不做nodejs的开发，也需要学习和使用NPM的，谁叫grunt/gulp、bower、yeoman这一堆的工具都通过NPM发布呢？！


## 什么是nodejs模块

Nodejs自身提供了基本的模块，但是开发实际应用过程中仅仅依靠这些基本模块则还需要较多的工作。幸运的是，Nodejs库和框架为我们提供了帮助，让我们减少工作量。但是成百上千的库或者框架管理起来又很麻烦，有了NPM，可以很快的找到特定服务要使用的包，进行下载、安装以及管理已经安装的包。

- http
- net
- url
- path


nodejs以包的形式组织程序模块，而包的定义却十分简单——包含文件内容符合规范package.json文件的目录或归档文件。并通过<package-name>@<version>来唯一标识每个包。

