# shutil.js

A Lightweight File Operating Library

[![Build Status](https://travis-ci.org/moriyalb/shutil.js.svg?branch=master)](https://travis-ci.org/moriyalb/shutil.js)
[![Coverage Status](https://coveralls.io/repos/github/moriyalb/shutil.js/badge.svg?branch=master)](https://coveralls.io/github/moriyalb/shutil.js?branch=master)

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)
<!-- [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges) -->

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

# Installation

Using npm:
```shell
$ npm i -g shutil.js
$ npm i shutil.js
```
Note: add --save if you are using npm < 5.0.0

In Node.js:
```js
const shutil = require('shutil.js')

let pwd = "."
for (let [root, dirs, files] of await shutil.walk(pwd)) {
	//
}
```

# Why shutil?

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

# API Documents

<font size="3"><strong>shutil.copy: (src, dest[, options]) -> Promise</strong></font>
```js
	/**
	 * Copy a file/directory to another directory/file
	 * directory -> directory will do things recursively
	 * @argument
	 * 		{src}:string the path,
	 * 		{dest}:string the path,
	 * 		{options}:object
	 * 			{override}:bool, if true, the same file in `dest` path will be overrided. 
	 * 						default false
	 * 			{aswhole}:bool, if true, the `src` directory will seems as a whole part to move. 
	 * 						default false (means only move all contained files in the `src` path)
	 * @returns
	 * 		{Promise}: nothing fulfilled.
	 * @short
	 * 		same as `shutil.cp`
	 */
	const shutil = require("shutil.js")
	await shutil.copy("./from", "./to", {override: true, aswhole: true}) 	// `/from` copy to `/to/from`
	await shutil.cp("./from", "./to", {override: true, aswhole: false}) 	// `/from` copy to `/to`
```

<font size="3"><strong>shutil.exists: (src) -> Promise</strong></font>
```js
	/**
	 * Check a dir/file is exists (or accessable)
	 * @argument
	 * 		{src}:string the path to check
	 * @returns
	 * 		{Promise}: fulfilled with true is the `src` path is exists, otherwise false.
	 */
	const shutil = require("shutil.js")
	if (await shutil.exists(".")) {
		//exists
	}
```

<font size="3"><strong>shutil.isdir: (src) -> Promise</strong></font>
```js
	/**
	 * Check `src` path is exist as a directory
	 * @argument
	 * 		{src}:string the path
	 * @returns
	 * 		{Promise}: fulfilled with true if `src` is a exist directory , otherwise false
	 */
	const shutil = require("shutil.js")
	if (await shutil.isdir("./dir")) {
		//exists
	}
```

<font size="3"><strong>shutil.isfile: (src) -> Promise</strong></font>
```js
	/**
	 * Check `src` path is exist as a file
	 * @argument
	 * 		{src}:string the path
	 * @returns
	 * 		{Promise}: fulfilled with true if `src` is a exist file , otherwise false
	 */
	const shutil = require("shutil.js")
	if (await shutil.isfile("./file")) {
		//exists
	}
```

<font size="3"><strong>shutil.listdir: (src) -> Promise</strong></font>
```js
	/**
	 * List all files/dirs contains in `src` path
	 * @argument
	 * 		{src}:string the path to list
	 * @returns
	 * 		{Promise}: fulfilled with a name list; if the `src` is not a exists directory, fulfilled with empty array `[]`
	 * @short
	 * 		exactly same as `shutil.ls`
	 */
	const shutil = require("shutil.js")
	for (let all of await shutil.listdir(".")) {
		
	}
	//shot usage
	console.log(`show dirs ${await shutil.ls('.')}`)
```

<font size="3"><strong>shutil.mkdirp: (src) -> Promise</strong></font>
```js
	/**
	 * Create a directory
	 * @argument
	 * 		{src}:string the path,
	 * @returns
	 * 		{Promise}: nothing fulfilled
	 * @short
	 * 		same as `shutil.md`
	 */
	const shutil = require("shutil.js")
	await shutil.mkdir("any/valid/path/will/be/created")
	await shutil.md("any/valid/path/will/be/created")
```

<font size="3"><strong>shutil.move: (src, dest[, options]) -> Promise</strong></font>
```js
	/**
	 * Move a file/directory to another directory/file
	 * file -> file means rename
	 * file -> directory means move
	 * directory -> directory will do things recursively
	 * @argument
	 * 		{src}:string the path,
	 * 		{dest}:string the path,
	 * 		{options}:object
	 * 			{override}:bool, if true, the same file in `dest` path will be overrided. 
	 * 						default false
	 * 			{aswhole}:bool, if true, the `src` directory will seems as a whole part to move. 
	 * 						default false (means only move all contained files in the `src` path)
	 * @returns
	 * 		{Promise}: nothing fulfilled.
	 * @short
	 * 		same as `shutil.mv`
	 */
	const shutil = require("shutil.js")
	await shutil.move("./from", "./to", {override: true, aswhole: false}) 	// `/from` move to `/to/from`
	await shutil.mv("./from", "./to", {override: true, aswhole: true})	 	// `/from` rename to `/to`
```

<font size="3"><strong>shutil.rmtree: (src) -> Promise</strong></font>
```js
	/**
	 * Remove a directory, everything will be removed.
	 * @argument
	 * 		{src}:string the path,
	 * @returns
	 * 		{Promise}: nothing fulfilled
	 * @short
	 * 		same as `shutil.rd`
	 */
	const shutil = require("shutil.js")
	await shutil.rmtree("any")
	await shutil.md("any")
```

<font size="3"><strong>shutil.walk: (src) -> Promise</strong></font>
```js
	/**
	 * Travers a directory
	 * @argument
	 * 		{src}:string the path,
	 * @returns
	 * 		{Promise}: fulfilled with a [root, dirs, files] array if `src` path is exists, otherwise fulfilled with empty array `[]`
	 */
	const shutil = require("shutil.js")
	for (let [root, dirs, files] of await shutil.walk(".")){

	}
```

# Todos
* filters
* excludes
