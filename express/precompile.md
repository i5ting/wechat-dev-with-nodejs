# precompile

预处理，主要是指针对需要编译的做的处理，比如js和css和html都有更好的写法。

- js： coffee、ts
- css： styleus、sass、scss、postcss
- html：各种模块，ejs、jade等，后面会单独讲

## css precompile

### create project

```
➜  nodejs-practice git:(master) express -h

  Usage: express [options] [dir]

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -e, --ejs           add ejs engine support (defaults to jade)
        --hbs           add handlebars engine support
    -H, --hogan         add hogan.js engine support
    -c, --css <engine>  add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git           add .gitignore
    -f, --force         force on non-empty directory
```


举例less

```
express express-less -c less
```

变动

- package.json
  - `"less-middleware": "1.0.x",`
- app.js
  - `app.use(require('less-middleware')(path.join(__dirname, 'public')));`

### 创建less

```
npm i -g less
lessc public/stylesheets/style.less public/stylesheets/style.css
```

## js precompile

举例coffee

http://coffeescript.org/

## gulp

- https://github.com/i5ting/stuq-gulp
- https://github.com/streakq/js-tools-best-practice/blob/master/doc/Gulp.md

