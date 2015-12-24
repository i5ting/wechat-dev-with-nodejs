function say(person) {
  console.log('i am say hello world to ' + person);
}

function eat(food) {
  console.log('i am eat ' + food);
}

exports.eat = eat;
exports.say = say;