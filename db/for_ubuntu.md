Overview

Use this tutorial to install MongoDB Community Edition on LTS Ubuntu Linux systems from .deb packages. While Ubuntu includes its own MongoDB packages, the official MongoDB Community Edition packages are generally more up-to-date.

- PLATFORM SUPPORT
MongoDB 仅长期支持64位的松散Ubuntu，这意味着目前只有 12.04 LTS (Precise Pangolin) 和 14.04 LTS (Trusty Tahr)两个版本的Ubuntu。

- Packages

在 MongoDB 官方仓库中提供如下的包：
```
mongodb-org	// 完成下面四个部分的安装
mongodb-org-server	// mongod 后台程序、相关配置和初始化脚本
mongodb-org-mongos	// mongos 后台程序
mongodb-org-shell	// mongo shell.
mongodb-org-tools	// MongoDB 工具: mongoimport bsondump, mongodump, mongoexport, mongofiles, mongooplog, mongoperf, mongorestore, mongostat, and mongotop.
```
These packages conflict with the mongodb, mongodb-server, and mongodb-clients packages provided by Ubuntu.


配置文件 /etc/mongod.conf 绑定的默认 IP 是 127.0.0.1 。Modify this setting as needed for your environment before initializing a replica set.

- Init Scripts

 mongodb-org package 包括各类初始化脚本，包括/etc/init.d/mongod。可以使用这些脚本启动、停止和重新启动后台进程。

The package configures MongoDB using the /etc/mongod.conf file in conjunction with the init scripts. See the Configuration File reference for documentation of settings available in the configuration file.

对于MongoDB@3.2.6，没有 mongos 的初始化脚本，mongos 进程只在分片中使用。那么在这个环境下，你可以使用自己电脑中mongos初始化脚本的mongod初始化脚本。参照mongos使用说明来进行详细配置。
 

- 安装 MongoDB

NOTE
想要安装最新版本，请参照之前版本的文件，例如要安装3.2，你可以参照3.0版本文件。

1.Import the public key used by the package management system.

Ubuntu 包管理工具 (i.e. dpkg and apt) 确保包的 一致性和可靠性 by requiring that distributors sign packages with GPG keys. 使用如下命令进入MongoDB的公共GPG秘钥:
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
```
2. 为MongoDB创建文件列表

创建 /etc/apt/sources.list.d/mongodb-org-3.2.list 文件列表。注意要根据不同的Ubuntu版本使用相应的命令，如下：
```
// Ubuntu 12.04
echo "deb http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

// Ubuntu 14.04
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
```

3. 重新加载本地数据库

使用如下命令:
```
sudo apt-get update
```

4. 安装MongoDB包

你可以安装最新的稳定 MongoDB 版本或特定版本.

安装最新稳定 MongoDB 版本，使用如下命名:
```
sudo apt-get install -y mongodb-org
Install a specific release of MongoDB.
```
安装特定版本，必须分别指定相应包的版本号，例如：

```
sudo apt-get install -y mongodb-org=3.2.6 mongodb-org-server=3.2.6 mongodb-org-shell=3.2.6 mongodb-org-mongos=3.2.6 mongodb-org-tools=3.2.6
```
如果只安装 mongodb-org=3.2.6 ，不安装组成的包，则会忽略你的指定来安装最新的包。

Pin a specific version of MongoDB.

Although you can specify any available version of MongoDB, apt-get will upgrade the packages when a newer version becomes available. To prevent unintended upgrades, pin the package. To pin the version of MongoDB at the currently installed version, issue the following command sequence:
```
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections
```

- 运行 MongoDB 

The MongoDB instance stores its data files in /var/lib/mongodb and its log files in /var/log/mongodb by default, and runs using the mongodb user account. You can specify alternate log and data file directories in /etc/mongod.conf. See systemLog.path and storage.dbPath for additional information.

If you change the user that runs the MongoDB process, you must modify the access control rights to the /var/lib/mongodb and /var/log/mongodb directories to give this user access to these directories.

1. 启动 MongoDB.

Issue the following command to start mongod:
```
sudo service mongod start
```

2. 证明 MongoDB 已经启动成功

在 /var/log/mongodb/mongod.log 日志文件中看到如下内容时说明启动成功。

[initandlisten] waiting for connections on port <port>
where <port> is the port configured in /etc/mongod.conf, 27017 by default.

3. 停止 MongoDB.

当需要停止MongoDB进程时使用如下命令:
```
sudo service mongod stop
```

4. 重新启动 MongoDB.

使用如下命令:
```
sudo service mongod restart
```

5. 使用 MongoDB.

MongoDB 在各种驱动版本中提供 Getting Started Guides（GSG） .

在生产环境中配置MongoDB之前，要认真查看说明文档。
然后，停止MongoDB，在运行mongod实例的终端按 Control+C 退出。

- 卸载 MongoDB

要从系统中完全删除 MongoDB，你必须删除MongoDB应用程序、配置文件、所有数据和日志文件。

注意：这将完全移除MongoDB，包括它的配置和所有的数据库，并且该操作是不可恢复的，所以请谨慎操作或事先做好备份。
1. 停止 MongoDB.

使用如下命令来停止mongod:
```
sudo service mongod stop
```

2. 删除安装包

删除所有之前安装过的包.
```
sudo apt-get purge mongodb-org*
```

3. 删除数据目录

删除 MongoDB 数据库和日志文件。

```
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb
```