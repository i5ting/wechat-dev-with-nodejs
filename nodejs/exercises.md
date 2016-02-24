# exercises

## 作业

- 写一个npm模块，并发布到npmjs.org上
- 如何去写一个cli工具，并发布到npmjs.org上

## 作业实例

最近我在做iOS适配了有一个算法，比如我在ps里测量高度是200px（ps里的2x的），也就是说它的实际告诉是100px

2x的frame是320*536
但是全能适配的视图的frame是400*800

所以需要转换一下

比如我取到的值是200，我需要200%2 = 100px的实际像素，但为了适配，我还需要100%0.85的适配高度


所以需求是，输入任意2x告诉，返回对应的适配高度

- calculator.js
- main.js

main.js里代码是

```
var result = require('./calculator')(100);

if(parseInt(result) == 117) {
  console.log('正确');
} else {
  console.log('错误');
}
```

