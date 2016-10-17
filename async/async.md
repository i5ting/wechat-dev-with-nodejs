# Async函数/Await（以前说是ES7 stage-3）

Generator的弊病是没有执行器，它本身就不是为流程控制而生的，所以co的出现只是解决了这个问题。

可是，你不觉得奇怪么？为什么非要加个co，才能好好的玩耍？为什么不能是直接就可以执行，并且效果和Yieldable一样的呢?

Async/Await 就是这样被搞出来的，很多人认为它是异步操作的终极解决方案。

<FONT COLOR=#26B4FD>**Await**</FONT>

Await的3种可能情况

- Await + Async函数
- Await + Promise
- await + co（co会返回Promise，这样可以Yieldable，但难度较大，适合老手）

头2种是比较常用的，第三种co作为promise生成器，是一种hack的办法。

下面给出第一种和第二种的示例：

```
async function a2() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  })
}

async function a1() {
  console.log("hello a1 and start a2");
  await a2();
  console.log("hello end a2");
}

async function a0() {
  console.log("hello a0 and start a1");
  await a1();
  console.log("hello end a1");
}

a0()
```

**执行**

需要使用babel或者其他支持async函数的编译工具，这里使用runkoa（是为koa支持async函数做的基于babel的简单封装）

```
$ runkoa async.js
async.js
3babel presets path = /Users/sang/.nvm/versions/node/v4.4.5/lib/node_modules/runkoa/node_modules/
hello a0 and start a1
hello a1 and start a2
hello end a2
hello end a1
```

**异常处理**

Node.js里关于异常处理有一个约定，即同步代码采用try/catch，非同步代码采用error-first方式。对于Async函数俩说，它的Await语句是同步执行的，所以最正常的流程处理是采用try/catch语句捕获，和generator/yield是一样的。

下面的代码所展示的是通用性的做法：

```
try {
  console.log(await asyncFn());
} catch (err) {
  console.error(err);
}
```

很多时候，我们需要把异常做得粒度更细致一些，这时只要把Promise的异常处理好就好了。

Promise里有2种处理异常的方法

- then(onFulfilled, onRejected)里的onRejected，处理当前Promise里的异常
- catch处理全局异常


**Async函数总结**

- Async函数语义上非常好
- Async不需要执行器，它本身具备执行能力，不像Generator
- Async函数的异常处理采用try/catch和Promise的错误处理，非常强大
- Await接Promise，Promise自身就足够应对所有流程了
- Await释放Promise的组合能力，外加Promise的then，基本无敌
