'use strict'

const fs = require('fs')

fs.readFile(__dirname + '/helloworld.js', (err, data) => {
  if (err) throw err
  console.log(data.toString())
});