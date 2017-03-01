# 模板引擎

模板引擎是一种复用思想，通过定义模板，用的时候和数据一起编译，生成html，以便浏览器渲染。从这个定义里我们可以找出几个关键点

```
编译(模板 + 数据) => html
```

模板引擎有好多种，下面介绍2种典型的模板引擎

- ejs：嵌入js语法的模板引擎（e = embed），类似于jsp，asp，erb的，在html里嵌入模板特性，如果熟悉html写起来就非常简单，只要区分哪些地方是可变，哪些地方是不变即可
- jade：缩进式极简写法的模板引擎，发展历史 `HAML -> Jade -> Slim -> Slm`，最早是ruby里有的，目前以jade用的最多，这种写法虽好，，但需要大脑去转换，这其实是比较麻烦的，如果对html不是特别熟悉，这种思维转换是非常难受的。

更多见 `https://github.com/tj/consolidate.js#supported-template-engines`

## ejs

### 准备工作

```
cd web/tpl/ejs
npm init(注意名字不要用ejs，不然无法安装ejs模块的)
touch index.js
npm install --save ejs
```

### 定义模板

首先我们定义`user.ejs`

```
<% if (user) { %>
    <h2><%= user.name %></h2>
<% } %>
```

这段模板里，首先我们看到的`if`语句,判断user对象是否存在，如果存在就显示`<h2>`标签，并把`user.name
`作为变量，嵌入到`<h2>`标签的显示内容里，一会编译的时候我们讲讲这种嵌入的好处。

我们知道模板原理

```
编译(模板 + 数据) => html
```
### 编译

下面我们看一下具体如何实现编译

```
var fs = require('fs')
var ejs = require('ejs')

// 读取模板文件，放到user_tpl_str变量中
var user_tpl_str = fs.readFileSync('./user.ejs').toString();

console.log(user_tpl_str)

// 通过ejs的render方法，对user_tpl_str和数据进行编译
var html = ejs.render(user_tpl_str, {
  user:{
    name: 'i5ting'
  }
});

console.log(html)
```

下面执行，看一下编译后的结果

```
$ node index.js
<% if (user) { %>
    <h2><%= user.name %></h2>
<% } %>

    <h2>i5ting</h2>
```

核心要点

1. 通过fs.readFileSync读取模板文件
1. 通过ejs.render方法进行编译
1. 模板是固定的，不可变，而数据可以在编译时填入的，是可变的
1. 编译后的结果是浏览器能够渲染的html代码

上面的数据是一个plain old object

```
{
  user:{
    name: 'i5ting'
  }
}
```

它是编译时传进去，也就是说我们可以按照自己的需要改变，并多次复用模板。

再想想`user.ejs`里的这句

```
    <h2><%= user.name %></h2>
```

它会编译成

```
    <h2>i5ting</h2>
```

如果我想让它输出其他名字呢？其实只要改变以user.name的数据即可


模板是可以嵌入逻辑的，上面的user.ejs里使用if指令，也就是只有满足条件的情况下才会输入对应的html，这在我们的页面里是经常使用的技巧。

```
// 如果user为空，测试编译结果
var empty_html = ejs.render(user_tpl_str, {
  user:undefined
});

console.log(empty_html)
```

这种情况下，执行是不会打出任何内容的，因为user不存在。

模板里支持for循环的，我们看一下`list.ejs`，列出所有用户列表

```
<ul>
  <% users.forEach(function(user){ %>
        <li><%= user.name %></li>
  <% }) %>
</ul>
```

核心代码

```
// 通过ejs的render方法，对user_tpl_str和数据进行编译
var html = ejs.render(user_tpl_str, {
  users:[
    {
      name: '朴灵'
    }, {
      name: 'alsotang'
    },{
      name: 'i5ting'
    }
  ]
});
```

这里主要是传入的数据是对象数组而已，然后模板里通过forEach遍历，然后再生产html，下面看一下执行结果

```
$ node list.js 
<ul>
  <% users.forEach(function(user){ %>
        <li><%= user.name %></li>
  <% }) %>
</ul>
<ul>
  
        <li>朴灵</li>
  
        <li>alsotang</li>
  
        <li>i5ting</li>
  
</ul>
```

其实还有很多特性，限于篇幅，这里就不详细讲了，自己查[看官方文档](https://github.com/tj/ejs)

## jade


### 准备工作

```
cd web/tpl/jade
npm init(注意名字不要用jade，不然无法安装jade模块的)
touch index.js
npm install --save pug
```

这里安装的pug模块，原因是jade因为版权问题，已更名为pug，但我们更喜欢称她为jade，所以本书都会这样约定，大家要注意区别

### 定义模板

`user.jade`

```
if user
  h2= user.name
```

这段模板里，首先我们看到的`if`语句,判断user对象是否存在，如果存在就显示`<h2>`标签，并把`user.name
`作为变量，嵌入到`<h2>`标签的显示内容里，和上面的ejs版本是一样的。

### 编译

下面我们看一下具体如何实现编译`index.js`

```
var fs = require('fs')
var pug = require('pug');

// 读取模板文件，放到user_tpl_str变量中
var user_tpl_str = fs.readFileSync('./user.jade').toString();

console.log(user_tpl_str)

// 通过ejs的render方法，对user_tpl_str和数据进行编译
var html = pug.render(user_tpl_str, {
  user:{
    name: 'i5ting'
  }
});

console.log(html)
```

对比一下上面ejs编译实现，其实就是把ejs模块替换成pug而已，其他都是一模一样的。


下面执行，看一下编译后的结果

```
$ node index.js 
if user
  h2= user.name
<h2>i5ting</h2>

```

重复一下核心要点

1. 通过fs.readFileSync读取模板文件
1. 通过pug.render方法进行编译
1. 模板是固定的，不可变，而数据可以在编译时填入的，是可变的
1. 编译后的结果是浏览器能够渲染的html代码


下面我们看一下在`jade`里如何使用for循环，显示用户列表，看`list.jade`

```
ul
  each user in users
    li= user.name
```


`index.js`编译核心代码

```
// 通过jade的render方法，对user_tpl_str和数据进行编译
var html = pug.render(user_tpl_str, {
  users:[
    {
      name: '朴灵'
    }, {
      name: 'alsotang'
    },{
      name: 'i5ting'
    }
  ]
});
```

是不是和ejs的一模一样?

执行效果是一模一样的，如下

```
$ node list.js
ul
  each user in users
    li= user.name
<ul><li>朴灵</li><li>alsotang</li><li>i5ting</li></ul>
```

更多用法见[官网](http://jade-lang.com/reference)

## 比较一下ejs和jade

`user.ejs`

```
<% if (user) { %>
    <h2><%= user.name %></h2>
<% } %>
```

特点

- 内嵌js语句`<% js语句 %>`
- html标签：`<h2>`

`user.jade`

```
if user
  h2= user.name
```

特点

- 内嵌js语句`if user`,和ejs里的不太一样，极简，没有括号和结尾大括号
- 极简html标签：`h2`

总结一下，如果大家对html/css/js不是特别熟悉，使用ejs是比较好的选择，学习成本较低。如果你是一个极客，并且对html/css/js有比较好的掌握，那么用jade更好一些，代码更少。其实技术选型更多的还是要看团队综合情况的，不是一个人的喜好选择。


## 设置

```
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
```

## jade

jade学习

- http://jade-lang.com/reference/
- https://github.com/i5ting/study-jade

html转jade是比较省力的一种方法

使用场景：尤其是写bootstrap的时候，当然静态页面转jade也一样

hade是一个html2jade.org的copy，平常打开这个网站比较慢，索性还是在本地弄一个，用的时候一条命令打开

    [sudo] npm install -g hade
    hade

![](https://github.com/i5ting/hade/raw/master/ScreenShot.png)

好处

- html和jade互转
- 对于学习jade是比较好的练习

详见https://github.com/i5ting/hade


## more

Template engine consolidation library for node.js

https://github.com/tj/consolidate.js


## Supported template engines

- [atpl](https://github.com/soywiz/atpl.js)
- [doT.js](https://github.com/olado/doT) [(website)](http://olado.github.io/doT/)
- [dust (unmaintained)](https://github.com/akdubya/dustjs) [(website)](http://akdubya.github.com/dustjs/)
- [dustjs-linkedin (maintained fork of dust)](https://github.com/linkedin/dustjs) [(website)](http://linkedin.github.io/dustjs/)
- [eco](https://github.com/sstephenson/eco)
- [ect](https://github.com/baryshev/ect) [(website)](http://ectjs.com/)
- [ejs](https://github.com/visionmedia/ejs)
- [haml](https://github.com/visionmedia/haml.js) [(website)](http://haml-lang.com/)
- [haml-coffee](https://github.com/9elements/haml-coffee) [(website)](http://haml-lang.com/)
- [hamlet](https://github.com/gregwebs/hamlet.js)
- [handlebars](https://github.com/wycats/handlebars.js/) [(website)](http://handlebarsjs.com/)
- [hogan](https://github.com/twitter/hogan.js) [(website)](http://twitter.github.com/hogan.js/)
- [htmling](https://github.com/codemix/htmling)
- [jade](https://github.com/visionmedia/jade) [(website)](http://jade-lang.com/)
- [jazz](https://github.com/shinetech/jazz)
- [jqtpl](https://github.com/kof/node-jqtpl) [(website)](http://api.jquery.com/category/plugins/templates/)
- [JUST](https://github.com/baryshev/just)
- [liquor](https://github.com/chjj/liquor)
- [lodash](https://github.com/bestiejs/lodash) [(website)](http://lodash.com/)
- [mote](https://github.com/satchmorun/mote) [(website)](http://satchmorun.github.io/mote/)
- [mustache](https://github.com/janl/mustache.js)
- [nunjucks](https://github.com/mozilla/nunjucks) [(website)](https://mozilla.github.io/nunjucks)
- [QEJS](https://github.com/jepso/QEJS)
- [ractive](https://github.com/Rich-Harris/Ractive)
- [react](https://github.com/facebook/react)
- [swig](https://github.com/paularmstrong/swig) [(website)](http://paularmstrong.github.com/swig/)
- [templayed](http://archan937.github.com/templayed.js/)
- [liquid](https://github.com/leizongmin/tinyliquid) [(website)](http://liquidmarkup.org/)
- [toffee](https://github.com/malgorithms/toffee)
- [underscore](https://github.com/documentcloud/underscore) [(website)](http://documentcloud.github.com/underscore/)
- [walrus](https://github.com/jeremyruppel/walrus) [(website)](http://documentup.com/jeremyruppel/walrus/)
- [whiskers](https://github.com/gsf/whiskers.js)
