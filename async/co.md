# 神奇的co

<!-- toc -->

## co是什么？

https://github.com/tj/co

> 官方说：The ultimate generator based flow-control goodness for nodejs (supports thunks, promises, etc)

我的解释

- 是generator的执行器
- 可是使用generator里的Yieldable支持的所有形式(supports thunks, promises, etc)
- 返回的结果是promise

那么它的用途就很明显了

- 所有出现generator的地方它都可以出现
- 在以后的async/await里await后面可以接promise

## 源码解析

co@4.6版本不到240行代码，整体来说，还算比较简单。但并不容易阅读

```
// 核心代码
function co(gen) {
  // 缓存this
  var ctx = this;
  var args = slice.call(arguments, 1)

  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  // 重点，co的返回值是Promise对象。为什么可以then和catch的根源
  return new Promise(function(resolve, reject) {
    // 如果你懂Promise规范，就知道这是解决状态回调，这是首次调用
    onFulfilled();

    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * @param {Error} err
     * @return {Promise}
     * @api private
     */
    // 如果你懂Promise规范，就知道这是拒绝状态回调
    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    // generator执行器
    // 如果ret.done，返回ret.value
    // 否则，
    function next(ret) {
      // 如果执行完成，直接调用resolve把promise置为成功状态
      if (ret.done) return resolve(ret.value);
      // 把yield的值转换成promise
      // 支持 promise，generator，generatorFunction，array，object
      // toPromise的实现可以先不管，只要知道是转换成promise就行了
      var value = toPromise.call(ctx, ret.value);
      // 成功转换就可以直接给新的promise添加onFulfilled, onRejected。当新的promise状态变成结束态（成功或失败）。就会调用对应的回调。整个next链路就执行下去了。
      // 为什么generator可以无限的next下去呢？
      // return value.then(onFulfilled, onRejected);意味着，又要执行onFulfilled了
      // onFulfilled里调用next(ret);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      
      // 如果以上情况都没发生，报错
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}
```

读此源码要点

- 必须深刻理解Promise实现，知道构造函数里的onFulfilled和onRejected是什么意思
- 必须了解generator的执行机制，理解迭代器里的next以及next的返回对象{value:'',done: true}


核心代码入口是onFulfilled，无论如何第一次的next(ret)是一定要执行的，因为generator必须要next()一下的。

所以next(ret)一定是重点，而且我们看onFulfilled和onRejected里都调用它，也就是所有的逻辑都会丢在这个next(ret)方法里。它实际上是一个状态机的简单实现。

```
// generator执行器
// 如果ret.done，返回ret.value
// 否则，
function next(ret) {
  // 如果执行完成，直接调用resolve把promise置为成功状态
  if (ret.done) return resolve(ret.value);
  // 把yield的值转换成promise
  // 支持 promise，generator，generatorFunction，array，object
  // toPromise的实现可以先不管，只要知道是转换成promise就行了
  var value = toPromise.call(ctx, ret.value);
  
  // 成功转换就可以直接给新的promise添加onFulfilled, onRejected。当新的promise状态变成结束态（成功或失败）。就会调用对应的回调。整个next链路就执行下去了。
  // 为什么generator可以无限的next下去呢？
  // return value.then(onFulfilled, onRejected);意味着，又要执行onFulfilled了
  // onFulfilled里调用next(ret);
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  
  // 如果以上情况都没发生，报错
  return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
    + 'but the following object was passed: "' + String(ret.value) + '"'));
}
```

情景1: 状态完成

```
  // 如果执行完成，直接调用resolve把promise置为成功状态
  if (ret.done) return resolve(ret.value);
```

情景2： next，跳回onFulfilled，递归

```
  // 成功转换就可以直接给新的promise添加onFulfilled, onRejected。当新的promise状态变成结束态（成功或失败）。就会调用对应的回调。整个next链路就执行下去了。
  // 为什么generator可以无限的next下去呢？
  // return value.then(onFulfilled, onRejected);意味着，又要执行onFulfilled了
  // onFulfilled里调用next(ret);
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  
```

情景3: 捕获异常

```
  // 如果以上情况都没发生，报错
  return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
    + 'but the following object was passed: "' + String(ret.value) + '"'));
```

以上是核心代码说明。之前我们讲了co实际有2种api，有参数和无参数的，很明显以上是无参数的generator执行器，那么有参数的wrap呢？

```
// 为有参数的generator调用，提供简单包装
co.wrap = function (fn) {
  createPromise.__generatorFunction__ = fn;
  return createPromise;
  function createPromise() {
    // 重点，把arguments给fn当参数。
    // call和apply是常规js api
    return co.call(this, fn.apply(this, arguments));
  }
};

```

通过call和apply组合使用，知识点比较简单，但这样用还是挺巧妙的。

其他的就基本是工具类了，其实也挺有意思的，自己看吧

## co引出的“血案”

ES6的Generator本意是为了计算而设计的迭代器，但tj觉得它可以用于流程控制，于是就有了co，co的历史可以说经历了目前所有的流程控制方案，而且由于支持Generator和yield就导致yieldable。

实际上co和Generator是把双刃剑，给了我们强大便利的同时，也增加了非常多的概念，可能是过渡性的，也可能是过时的。

可是，你真的需要了解这么多么？从学习的角度，当然是多多意义，如果从实用的角度看，你可能不需要。

存在即合理，那么我们就看看这“血案”吧:

- 学习ES6的Generator
- 了解ES6的迭代器和迭代器相关的2种协议，了解for-of
- 了解co和co的2种用法，源码
- 了解yieldable 5种（包括不常用Thunk）
- 如果是koa，还需要了解convert和compose
