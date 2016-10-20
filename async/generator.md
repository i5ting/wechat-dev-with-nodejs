# 生成器Generators/yield

Generator Function（生成器函数）和Generator（生成器）是ES6引入的新特性，该特性早就出现在了Python、C#等其他语言中。生成器本质上是一种特殊的<FONT COLOR=#336DB7>迭代器https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/The_Iterator_protocol</FONT>。

Generator函数本意是iterator生成器，函数运行到yield时退出，并保留上下文，在下次进入时可以继续运行。

生成器函数也是一种函数，语法上仅比普通function多了个星号* ，即function* ，在其函数体内部可以使用yield和yield* 关键字。

简单理解，这是ES6的新特性，function 后面带 * 的叫做Generator，如以下代码所示。

## 执行示例

```
function* doSomething() {
  ....
}
```

先看一下Generator如何执行：

```
function* doSomething() {
    console.log('1');
    yield; // Line (A)
    console.log('2');
}

var gen1 = doSomething();

gen1.next(); // Prints 1 then pauses at line (A)
gen1.next(); // resumes execution at line (A), then prints 2
```

**说明**

- gen1是产生出来的Generator对象
- 第一个next，会打印出1，之后悬停在 yield所在行，即Line (A)
- 第二个next，恢复line (A)点的执行，之后打印出2

## next的返回结果说明

```
function* doSomething() {
    console.log('1');
    yield; // Line (A)
    console.log('2');
}

var gen1 = doSomething();

console.log(gen1.next()); // {value:'', done: false}
console.log(gen1.next()); // {value:'', done: true}
```

第1个`gen1.next()`结果

```
next的返回对象{value:'', done: false}
```

第2个`gen1.next()`结果

```
next的返回对象{value:'', done: true}
```

如果done为true，则代表generator里的yield都完成了。这直接关系到后面的co实现，所以此处必须理解。

## 如果generator里有多个yield呢？

如果generator里有多个yield呢？

那么会有无穷无尽的next。

于是tj就写[co](https://github.com/tj/co)这个著名的Generator执行器，co目前已经是v4了，彻底的面向Promise了，个中曲折也是够八卦的了。

这就是下一节要讲的内容。