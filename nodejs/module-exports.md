# module-exports

## 比较一下module.exports 和exports.xxx

module.exports才是真正的接口，exports只不过是它的一个辅助工具。　最终返回给调用的是module.exports而不是exports。

所有的exports收集到的属性和方法，都赋值给了module.exports。

当然，这有个前提，就是Module.exports本身不具备任何属性和方法。如果module.exports已经具备一些属性和方法，那么exports收集来的信息将被忽略

### 共存的噩梦

修改exports.js如下：

```
module.exports = 'Exports IT!';
exports.name = function () {
  console.log('hello world');
}
```

再次引用执行e_main.js

```
var hello = require('./exports');

console.log(hello.name())
```

发现报错：对象hello没有name方法

exports模块忽略了exports收集的name方法，返回了一个字符串“Exports IT!”。

由此可知，你的模块并不一定非得返回“实例化对象”。

你的模块可以是任何合法的javascript对象--boolean, number, date, JSON, string, function, array等等。

你的模块可以是任何你设置给它的东西。如果你没有显式的给module.exports设置任何属性和方法，那么你的模块就是exports设置给module.exports的属性。

### string

```
exports.name = "StuQ微课堂"
```

### boolean

布尔值就是真或者假，在js表示为true或false

```
exports.is_valid = true
```

### number

数值有很多种，大家记得它是描述数字相关的即可

常见如整形，浮点型

年龄

```
exports.age = 20
```

圆周率

```
var  pi = 3.1415;
exports.PI = pi
```

### date

日期类型

```
var date = new Date()

exports.created_at = date;
```

那么怎么样获取2015-11-20呢？

使用[momentjs](http://momentjs.com/docs/)

首先需要安装momentjs

```
npm install --save moment
```

date.js实例代码

```
var moment = require('moment');
var date = moment().format('YYYY-MM-DD');

exports.created_at = date;
```

测试main.js

```
var date = require('./date');

console.log(date.created_at);
```

执行结果如下

```
➜  nodejs-practice git:(master) ✗ node nodejs/demo/date/main.js
2015-11-20
```

###  JSON

json.js

```
exports.person = {
  name: "西瓜",
  age:18
}
```

创建main.js

```
var json = require('./json')

console.log(json.person.name);

// console.log(json.persion);
for(var k in json.person){
  console.log("key = " + k + " && value = " + json.person[k]);
}
```
### 最简单的面向对象

下面例子中，你的模块是一个类exports2.js：

```
module.exports = function(name, age) {
    this.name = name;
    this.age = age;
    this.about = function() {
        console.log(this.name +' is '+ this.age +' years old');
    };
};
```

可以这样应用它：

```
var Person = require('./exports2');
var p = new Person('Ting', 20);
p.about(); // Ting is 20 years old
```


### 数组

下面例子中，你的模块是一个数组：

```
module.exports = ['eric', '海角', '西瓜', '李小贱', 'kevin'];
```

可以这样应用它：

```
var arr = require('./exports3.js');
console.log('第3个是西瓜： ' + arr[2]);


console.log('-------------------\n');

for(var i = 0; i < arr.length; i++){
  console.log("第" + i + "个是 " + arr[i]);
}

console.log('-------------------\n');

for(var i = 1; i < arr.length; i++){
  console.log("第" + i + "个是 " + arr[i]);
}


console.log('-------------------\n');

var i = 0;
arr.forEach(function(name){
  console.log("第" + i + "个是 " + name);
  i++;
})
```

现在你应该明白了，如果你想你的模块是一个特定的类型就用module.exports。

如果你想的模块是一个典型的“实例化对象”就用exports。

给Module.exports添加属性类似于给exports添加属性。例如：

```
module.exports.name = function() {
    console.log('My name is Lemmy Kilmister');
};
```

同样，exports是这样的

```
exports.name = function() {
    console.log('My name is Lemmy Kilmister');
};
```

请注意，这两种结果并不相同。

前面已经提到module.exports是真正的接口，exports只不过是它的辅助工具。

推荐使用exports导出，除非你打算从原来的“实例化对象”改变成一个类型

## dependency cycle循环引用



a.js

```
console.log('a starting');
exports.done = false;
var b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

b.js

```
console.log('b starting');
exports.done = false;
var a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

main.js

```
console.log('main starting');
var a = require('./a.js');
var b = require('./b.js');
console.log('in main, a.done=%j, b.done=%j', a.done, b.done);
```

当main.js加载a.js的时候，a.js加载b.js，同时，b.js想要加载a.js，这时候就产生了依赖闭环的问题，为了避免无限循环，需要打破这个闭环。根据CommonJS Modules/1.0规范中的说明「在这种情况下，”require”返回的对象必须至少包含此外部模块在调用require函数（会进入当前模块执行环境）之前就已经准备完毕的输出。」，有些绕，让我们从依赖闭环产生的地方跟踪，b.js需要require a.js，这里b.js做为当前模块，a.js相对于b.js来说是外部模块，那么a.js的输出应该是在其require b.js之前（即「进入当前模块执行环境」）就应该返回，执行过程如下：

a.js

```
console.log('a starting');
exports.done = false;
// 只执行到这里，然后exports返回给调用模块(b.js)，以下被丢弃
var b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

然后b.js继续执行完成。以下是执行结果：

```
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done=true, b.done=true
```

注意，虽然main.js同时require了a.js和b.js，但是根据node.js的模块缓存策略，模块只执行一次。

