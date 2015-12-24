default-user-agent
=======

[![Build Status](https://secure.travis-ci.org/fengmk2/default-user-agent.png)](http://travis-ci.org/fengmk2/default-user-agent) [![Dependency Status](https://gemnasium.com/fengmk2/default-user-agent.png)](https://gemnasium.com/fengmk2/default-user-agent)

[![NPM](https://nodei.co/npm/default-user-agent.png?downloads=true&stars=true)](https://nodei.co/npm/default-user-agent/)

![logo](https://raw.github.com/fengmk2/default-user-agent/master/logo.png)

Default user agent string for nodejs http request

## Install

```bash
$ npm install default-user-agent
```

## Usage

```js
var ua = require('default-user-agent');

// darwin
console.log(ua()); // 'node/v0.11.11 (darwin 13.1.0; x64)'
console.log(ua('urllib', '0.0.1')); // 'urllib/0.0.1 node/v0.11.11 (darwin 13.1.0; x64)'

// linux
// 'node/v0.11.11 (linux 3.11.0-12-generic; x64)'
```

## License

(The MIT License)

Copyright (c) 2014 fengmk2 &lt;fengmk2@gmail.com&gt; and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
