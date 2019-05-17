# shutil.js

A Lightweight File Operating Library

[![Build Status](https://travis-ci.org/moriyalb/shutil.js.svg?branch=master)](https://travis-ci.org/moriyalb/shutil.js)
[![Coverage Status](https://coveralls.io/repos/github/moriyalb/shutil.js/badge.svg?branch=master)](https://coveralls.io/github/moriyalb/shutil.js?branch=master)
[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)
#[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![Slack](https://img.shields.io/badge/slack-996icu-green.svg?style=flat-square)](https://join.slack.com/t/996icu/shared_invite/enQtNjI0MjEzMTUxNDI0LTkyMGViNmJiZjYwOWVlNzQ3NmQ4NTQyMDRiZTNmOWFkMzYxZWNmZGI0NDA4MWIwOGVhOThhMzc3NGQyMDBhZDc)
[![HitCount](http://hits.dwyl.io/996icu/996.ICU.svg)](http://hits.dwyl.io/996icu/996.ICU)

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
