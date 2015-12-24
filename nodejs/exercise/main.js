var result = require('./calculator')(100);

if(parseInt(result) == 117) {
  console.log('正确');
} else {
  console.log('错误');
}