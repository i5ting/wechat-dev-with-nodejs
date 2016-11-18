# 了解MONGODB的部署

- replset
- shard

我写的《 mongodb运维之副本集实践》

https://cnodejs.org/topic/5590adbbebf9c92d17e734de


## Mac OS X

Install Homebrew package manager. Then follow the steps below to install and setup MongoDB.

```
  # Update Homebrew's package database
  $ brew update

  # Install MongoDB
  $ brew install mongodb

  # Create the data directory
  $ sudo mkdir -p /data/db

  # Set permissions for the data directory
  $ sudo chown -R `whoami` /data/db

  # Run MongoDB Server
  $ mongod
```

## Windows

- Download and install the current stable release.
- Create the data directory: C:\data\db.
- Run MongoDB Server by opening mongod.exe in C:\Program Files\MongoDB\Server\3.2\bin.

## ubuntu

https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

```
  # Import the public key used by the package management system
  $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

  # Create a source list file for MongoDB
  $ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

  # Update the repository
  $ sudo apt-get update

  # Install the latest stable version of MongoDB
  $ sudo apt-get install -y mongodb-org

  # Start MongoDB service
  $ sudo service mongod start
```



参考 https://github.com/sahat/megaboilerplate