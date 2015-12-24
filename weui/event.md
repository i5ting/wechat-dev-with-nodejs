# fastclick

这效果其实看起来已经不错了，足够留畅，也比较酷

但是点击按钮还是觉得有点慢，尤其是一些低端机上，回想上节讲的《事件：touch和click的区别》，似乎我们还能更完美

### 事件：touch和click的区别

在web里只有click，而移动端既有click又有touch，所以问题就来了

我怎么样区分它们呢？

三种在规范中列出并获得跨移动设备广泛实现的基本触摸事件：

1. touchstart ：手指放在一个DOM元素上。
1. touchmove ：手指拖曳一个DOM元素。
1. touchend ：手指从一个DOM元素上移开。

其实还有一个touchcancel

其实click也是touch，不过先识别一下，如果是touch就是touch，如果不是touch就当click处理。

结论肯定是touch反应比click快，所以移动的有一个比较好的实践

1. 使用zeptojs的tap的手势
1. 使用fastclick库

### 用法

https://github.com/ftlabs/fastclick

用法

```
FastClick.attach(document.body);
```

attach方法是给对应的selector增加快速点击事件，也就是把click转成touch。


简单封装

```
function add_fast_click(){
  if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', function() {
          FastClick.attach(document.body);
      }, false);
  }
}

add_fast_click();
```