/**!
 * default-user-agent - index.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var os = require('os');

var USER_AGENT = 'node/' + process.version
  + ' (' + process.platform + ' ' + os.release()
  + '; ' + process.arch + ')';

module.exports = function ua(name, version) {
  if (arguments.length !== 2) {
    return USER_AGENT;
  }
  return name + '/' + version + ' ' + USER_AGENT;
};
