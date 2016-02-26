# Nodejs代码调试

## 总结：区分一下这节的几个英文单词

- module是模块的意思，node module就是node模块的意思
- export是导出的意思，也可以译为暴露。exports是export的复数形式

组合起来：`module.exports`就是模块暴露，即此模块提供的接口或变量

- require是需要的意思，也可以译为引用，调用。

引用某个js文件或者模块，就是我想调用它暴露的接口，打成我的目的。

require其实还有一层含义按需加载的意思，比如我们常见的amd，cmd规范等，都是前端目前比较流行的按需加载规范，典型实现如seajs、requirejs

是不是又把requirejs和require打通了？

稍微八卦一下，nodejs里多次require一个模块的时候，它只会加载一次，这是nodejs的模块缓存机制，见https://nodejs.org/api/modules.html#modules_caching

另外typescript里，require了的模块，如无引用是不编译的，也算类似的按需加载的一种吧

现在，我们来总结一下，上面的几个英文词

- module
- exports
- require

其实是commonJS规范的核心的3个概念，而nodejs是commonJS规范的实现。

这就是为啥满大街的nodejs代码都长成这样的根本原因。

可以说，这才是nodejs真正的基础，如果不懂，你还真的好好看几遍


## 如何调试


3法3例子

http://i5ting.github.io/node-debug-tutorial/