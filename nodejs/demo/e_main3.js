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

