# precompile

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




## gulp

https://github.com/streakq/js-tools-best-practice/blob/master/doc/Gulp.md

