# phpMyAdmin updater
Make phpMyAdmin easy update in one command -> `node index.js`.

## Installation
* Download.
* Extract files.
* Copy **sample.config.json** to **config.json** and modify the values as needed.
* Install Node packages use `npm install` or `npm update` command.

## Run update
### Via Node.js
```
node index.js
```

### Via Windows batch (.bat) file
* Create a file, for example **phpmaupdate.bat**.
* Add the code below
```
@ECHO OFF

call node "D:\my\path\to\app\index.js" %*
```
* Change **D:\my\path\to\app** to your full path to where you extracted files.
* Add folder path where contain this **phpmaupdate.bat** to Windows environment and you can run this file from everywhere.
* Run `phpmaupdate` in your command line.