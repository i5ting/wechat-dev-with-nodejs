# weui

WeUI是一套同微信原生视觉体验一致的基础样式库，由微信官方设计团队为微信 Web 开发量身设计，可以令用户的使用感知更加统一。包含button、cell、dialog、 progress、 toast、article、icon等各式元素。

严格的讲它是一个css库。算一个精简的库

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
        <title>WeUI</title>
        <link rel="stylesheet" href="path/to/weui/dist/style/weui.min.css"/>
    </head>
    <body>

    </body>
</html>
```

但它的demo里提供了不少好东西

打开weui/examples/index.html就可以演示效果

![](weui.gif)

- 模板是加载，替换了常规的ajax（页面少的时候是个好办法）
- 实现了container里的显示隐藏效果
- pushstate改变url

结构

- container
  - page1
  - page2
  
看一下代码结构

![](3.png)

### helloworld

copy 

```
<div class="container js_container">
  ...
</div>
```

预览一下效果，看到图片都未展示，于是把example里的images放到public/images下

此时预览，发现图片特别大，这肯定是css没有加载，于是把example.css放到public/demo下
改名为myweui.css

在html里引入即可

```
<link rel="stylesheet" href="./myweui.css" />
```

此时预览就可以了。此例用于测试样式是足够的，是为helloworld1

可是我如何点击，进入下一页呢

### 多页操作

把之前例子的

```
    <script type="text/html" id="tpl_button">
        <div class="page">
            <div class="hd">
                <h1 class="page_title">Button</h1>
            </div>
            <div class="bd spacing">
                <a href="javascript:;" class="weui_btn weui_btn_primary">按钮</a>
                <a href="javascript:;" class="weui_btn weui_btn_disabled weui_btn_primary">按钮</a>
                <a href="javascript:;" class="weui_btn weui_btn_warn">确认</a>
                <a href="javascript:;" class="weui_btn weui_btn_disabled weui_btn_warn">确认</a>
                <a href="javascript:;" class="weui_btn weui_btn_default">按钮</a>
                <a href="javascript:;" class="weui_btn weui_btn_disabled weui_btn_default">按钮</a>
                <div class="button_sp_area">
                    <a href="javascript:;" class="weui_btn weui_btn_plain_default">按钮</a>
                    <a href="javascript:;" class="weui_btn weui_btn_plain_primary">按钮</a>

                    <a href="javascript:;" class="weui_btn weui_btn_mini weui_btn_primary">按钮</a>
                    <a href="javascript:;" class="weui_btn weui_btn_mini weui_btn_default">按钮</a>
                </div>
            </div>
        </div>
    </script>
```

放到.container下面，这样就定义了模板

此时点击button按钮是不会有显示的。

那么我再找找例子里，是不是少什么东西?

把example.js放到public/demo下，改名为myweui.js

引入

```
    <script src="./myweui.js"></script>
```

此时刷新就好了。

也就是说所有的东西都在这个js里，我们之前说的pushstate、各种效果等都在这里

看一下按钮是如何定义和响应的

```
<a class="weui_cell js_cell" href="javascript:;" data-id="button">
    <span class="weui_cell_hd">
      <img src="/images/icon_nav_button.png" class="icon_nav" alt=""></span>
    <div class="weui_cell_bd weui_cell_primary">
        <p>Button</p>
    </div>
    <div class="weui_cell_ft">
    </div>
</a>
```

- class="weui_cell js_cell"
- data-id="button"

这样就行了？

我们看一下myweui.js

```
$(function () {
```

这很明显是zeptojs写法

```
// page stack
var stack = [];
var $container = $('.js_container');
$container.on('click', '.js_cell[data-id]', function () {
    var id = $(this).data('id');
    go(id);
});
```

头几行，定义了一个stack，我们想一下那个推进来的效果，

- 默认显示，为栈的第一个元素
- 如果push进来就，stack里push一个，设置为当前显示的
- 如果点击返回呢，stack里pop出去最后一个，设置上一个为显示的
- 如果返回了栈顶，点返回就没效果了

这里的click事件，它的事件是.js_cell[data-id]

也就是class=js_cell，并且有data-id属性。

对比一下button的按钮

```
<a class="weui_cell js_cell" href="javascript:;" data-id="button">
```

如此，大概你就该明白了。

那么事件里面是

```
var id = $(this).data('id');
go(id);
```

就用button这个例子讲，这个id应该是data-id="button"里的button，对吧？

然后go就跳转了，也就是push的效果应该是它弄的

```
function go(id){
    var $tpl = $($('#tpl_' + id).html()).addClass('slideIn').addClass(id);
    $container.append($tpl);
    stack.push($tpl);
    // why not use `history.pushState`, https://github.com/weui/weui/issues/26
    //history.pushState({id: id}, '', '#' + id);
    location.hash = '#' + id;

    $($tpl).on('webkitAnimationEnd', function (){
        $(this).removeClass('slideIn');
    }).on('animationend', function (){
        $(this).removeClass('slideIn');
    });
    // tooltips
    if (id == 'cell') {
        $('.js_tooltips').show();
        setTimeout(function (){
            $('.js_tooltips').hide();
        }, 3000);
    }
}
```

看一下源码

- $container.append($tpl);是dom元素插入
- stack.push($tpl); 视图栈压入最新的
- location.hash = '#' + id;是pushstate更改url地址
- 其他就是动画或者根据id干点坏事了

稍微注意一下：我们push的页面从哪里来的？

```
var $tpl = $($('#tpl_' + id).html()).addClass('slideIn').addClass(id);
$container.append($tpl);
```

我们知道id是data-id="button"里的button，也就是说我们要根据id=“tpl_button”来找模板里的html。

想想我们之前是不是拷贝了一个这样的模板？

ok，只要是class=js_cell，并且有data-id属性的就会触发点击时间，根据tpl_button里的内容显示（push）。


这是push，那么返回pop呢？

```
// location.hash = '#hash1' 和点击后退都会触发`hashchange`，这个demo页面只关心后退
$(window).on('hashchange', function (e) {
    if (/#.+/gi.test(e.newURL)) {
        return;
    }
    var $top = stack.pop();
    if (!$top) {
        return;
    }
    $top.addClass('slideOut').on('animationend', function () {
        $top.remove();
    }).on('webkitAnimationEnd', function () {
        $top.remove();
    });
});
```

location.hash变了

- var $top = stack.pop();很明显出栈了
- if (!$top) {return;} 是如果栈顶，不做操作
- 然后处理$top，然后出栈的视图移除掉

最外面的视图移除了，很明显就是上一个视图显示了。

so，原理就是这么简单


时间有限，视图和其他点击事件控件的演示就不讲了

### weui的缺点

weui的优点

- 它很好的解决推入和返回的问题
- 它有微信一样的ui界面
- 它还提供了基本的ui组件（弹出框，actionsheet等）

那么它的缺点呢？页面内容过长的时候，滑动不流畅，以为它就没解决这个问题呢

这不正是iscroll解决的问题么？

如果weui加上iscroll的特性，是不是就很棒了？

