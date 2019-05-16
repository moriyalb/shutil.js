# shutil.js

A Lightweight File Operating Library

[![Coverage Status](https://coveralls.io/repos/github/moriyalb/shutil.js/badge.svg?branch=master)](https://coveralls.io/github/moriyalb/shutil.js?branch=master)

## Installation

Using npm:
```shell
$ npm i -g shutil
$ npm i shutil
```
Note: add --save if you are using npm < 5.0.0

In Node.js:
```js
const shutil = require('shutil')

let pwd = "."
for (let [root, dirs, files] of await shutil.walk(pwd)) {
	//
}
```

## Why shutil?

This `FileSystem` module in Node.JS is pretty simple but we want more.

Try this
```js
const fs = require('fs')
fs.rmdirSync("..") //Woops Error: ENOTEMPTY: directory not empty, rmdir ".."
```

Or this
```js
const fs = require('fs')
fs.mkdirSync("../a/b/c") //Woops Again Error: ENOENT: no such file or directory, mkdir "./a/b/c"
```

Or this
```js
const fs = require('fs')
//fs.walk(".") //Woops How to do this?
```

shutil will make all this things easier. 

More important, shutil will do nothing more beyond pure file system operations.
