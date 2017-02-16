# 熟悉api写法

error-first api写法 && EvenEmit 

## Error-first Callback

如果说Google的V8引擎是Node.js的心脏，那么回调则是Node的脉络，回调能够激活跨模块和应用程序之间平衡的、非堵塞的异步控制流程，因此，在实际编写时，我们需要一个通用的可依赖的回调编程方式，error-first回调，也称为errorback或errback或node-style callback，它们都是用来解决这个问题。

> 这是api写法约定，在异步回掉函数里，第一个参数是error

举例


所有人都要遵守

## EvenEmit
