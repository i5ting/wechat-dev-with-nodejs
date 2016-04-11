var Redis = require('ioredis');

module.exports = function () {
  return new Redis(6379, '127.0.0.1');
};