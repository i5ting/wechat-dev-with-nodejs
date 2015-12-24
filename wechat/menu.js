var api = require('.')
var menu = require('./menu.json')

api.createMenu(menu, function(err, result){
  console.log(err, result)
});