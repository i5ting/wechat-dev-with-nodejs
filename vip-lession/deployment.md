# 部署

## 采用云服务器

比如阿里云，coding其实也可以凑合着用

- server
- db
- slb
- 监控

## pm2

https://github.com/Unitech/pm2


```
$ npm install pm2 -g            # Install PM2
$ pm2 start app.js              # Start, Daemonize and auto restart application
$ pm2 start app.js -i 4         # Start 4 instances of application in cluster mode
                                # it will load balance network queries to each app
$ pm2 start app.js --name="api" # Start application and name it "api"
$ pm2 start app.js --watch      # Restart application on file change
$ pm2 start script.sh           # Start bash script

$ pm2 list                      # List all processes started with PM2
$ pm2 monit                     # Display memory and cpu usage of each app
$ pm2 show [app-name]           # Show all informations about application

$ pm2 logs                      # Display logs of all apps
$ pm2 logs [app-name]           # Display logs for a specific app
$ pm2 flush

$ pm2 stop all                  # Stop all apps
$ pm2 stop 0                    # Stop process with id 0
$ pm2 restart all               # Restart all apps
$ pm2 reload all                # Reload all apps in cluster mode
$ pm2 gracefulReload all        # Graceful reload all apps in cluster mode
$ pm2 delete all                # Kill and delete all apps
$ pm2 delete 0                  # Delete app with id 0
$ pm2 scale api 10              # Scale app with name api to 10 instances
$ pm2 reset [app-name]          # Reset number of restart for [app-name]

$ pm2 startup                   # Generate a startup script to respawn PM2 on boot
$ pm2 save                      # Save current process list
$ pm2 resurrect                 # Restore previously save processes
$ pm2 update                    # Save processes, kill PM2 and restore processes
$ pm2 generate                  # Generate a sample json configuration file

$ pm2 deploy app.json prod setup    # Setup "prod" remote server
$ pm2 deploy app.json prod          # Update "prod" remote server
$ pm2 deploy app.json prod revert 2 # Revert "prod" remove server by 2

$ pm2 module:generate [name]    # Generate sample module with name [name]
$ pm2 install pm2-logrotate     # Install module (here a log rotation system)
$ pm2 uninstall pm2-logrotate   # Uninstall module
$ pm2 publish                   # Increment version, git push and npm publish
```
