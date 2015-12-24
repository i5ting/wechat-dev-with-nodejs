var json = require('./json')

console.log(json.person.name);

// console.log(json.persion);
for(var k in json.person){
  console.log("key = " + k + " && value = " + json.person[k]);
}

