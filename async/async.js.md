# async.js

- 仓库 https://github.com/caolan/async
- 文档 http://caolan.github.io/async/

比如each方法，依次完成

```
async.each(openFiles, saveFile, function(err){
  // if any of the saves produced an error, err would equal that error
});
```

比如瀑布式的

```
async.waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
});

// Or, with named functions:
async.waterfall([
    myFirstFunction,
    mySecondFunction,
    myLastFunction,
], function (err, result) {
    // result now equals 'done'
});
function myFirstFunction(callback) {
    callback(null, 'one', 'two');
}
function mySecondFunction(arg1, arg2, callback) {
    // arg1 now equals 'one' and arg2 now equals 'two'
    callback(null, 'three');
}
function myLastFunction(arg1, callback) {
    // arg1 now equals 'three'
    callback(null, 'done');
}
```

比如对各种api或数据结构的扩展。

总之async.js是个不错的库，但比过于独立，和promise/a+规范不一样，也就是说我们需要多学aysnc.js，又不能和promise/a+一起用

所以，不如直接上promise/a+。
