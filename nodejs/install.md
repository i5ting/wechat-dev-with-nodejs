# install

3m安装法

- nvm
- npm
- nrm

## 安装nvm

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
```

cat ~/.bashrc

```
export NVM_DIR="/home/coding/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
```

但coding默认使用的zsh，所以需要把环境变量放到


```
vi ~/.zshrc
```

追加

```
export NVM_DIR="/home/coding/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
```

然后，source使环境变量生效

```
source ~/.zshrc
```

## 安装nodejs

4.2是LTS是长期支持版本，无论是开发还是产品模式都推荐安装4.2版本。


```
nvm install 4.2
```

默认使用4.2版本进行编译，操作如下：


```
➜  workspace git:(i5ting) nvm alias default 4.2
default -> 4.2 (-> v4.2.2)
```

此时，你输入`node -v`

```
➜  workspace git:(i5ting) node -v
v4.2.2
```

如果想安装其他版本，请参照上面步骤


## 安装或更新npm

```
➜  nodejs-practice git:(master) ✗ node -v
v4.0.0
➜  nodejs-practice git:(master) ✗ npm -v
2.14.2
➜  nodejs-practice git:(master) ✗ npm install -g npm@2.9
```

说明npm 3.x和2.x差别非常大，3.x目前还不够稳定，建议用2.x


## 安装nrm(npm registry manager)

https://github.com/Pana/nrm

nrm can help you easy and fast switch between different npm registries, now include: npm, cnpm, eu, au, sl(strongloop), nj(nodejitsu), pt(Portuguese).

Recently npm has some problem frequently, nrm will be helpful to all noders.

registry是指从哪个源下载nodejs模块

```
$ npm install -g nrm
```

- nrm test
- nrm ls
- nrm use




