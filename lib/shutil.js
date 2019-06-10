"use strict"

const _ = require("lodash")
const fsp = require("fs").promises
const path = require("path")

//use linux sep.
const sep = "/" 

let shutil = {

	/**
	 * Create a directory
	 * @argument
	 * 		{src}:string the path,
	 * @returns
	 * 		{Promise}: nothing fulfilled
	 * @short
	 * 		same as `shutil.md`
	 */
	mkdirp: async (src) => {
		src = src.replace(/\\/g, `/`)
		let dirs = src.split(`/`)
		let spath = ""
		while (dirs.length > 0){			
			spath = spath.concat(dirs.shift()).concat(sep)
			try{
				await fsp.access(spath)
			}catch(err){
				await fsp.mkdir(spath)
			}
		}
	},

	/**
	 * Remove a directory, everything will be removed.
	 * @argument
	 * 		{src}:string the path,
	 * @returns
	 * 		{Promise}: nothing fulfilled
	 * @short
	 * 		same as `shutil.rd`
	 */
	rmtree: async (src) => {
		src = src.replace(/\\/g, `/`)
		try {
			await fsp.access(src)
			let all = await fsp.readdir(src)
			for (let fd of all){
				let fpath = [src, fd].join(sep)
				let stat = await fsp.stat(fpath)
				if (stat.isDirectory()) { // recurse
					await shutil.rmtree(fpath)
				} else { // delete file
					await fsp.unlink(fpath)
				}
			}					
			await fsp.rmdir(src)
		}catch(err){

		}
	},

	/**
	 * Travers a directory
	 * @argument
	 * 		{src}:string the path,
	 * @returns
	 * 		{Promise}: fulfilled with a [root, dirs, files] array if `src` path is exists, otherwise fulfilled with empty array `[]`
	 */
	walk: async (src) => {
		src = src.replace(/\\/g, `/`)
		if (!await shutil.isdir(src)) return []

		let all = await fsp.readdir(src)
		let dirs = []
		let files = []
		let result = []
		for (let fd of all){
			let fpath = [src, fd].join(sep)
			let stat = await fsp.stat(fpath)
			if (stat.isDirectory()) {
				dirs.push(fd)
				let subs = await shutil.walk(fpath)
				if (!!subs) result = result.concat(subs)
			} else {
				files.push(fd)
			}
		}		
		if (dirs.length + files.length > 0){
			result.push([src, dirs, files])
		}		
		return result
	},

	__copyFile: async(src, dest, opts = {}, remove = false) => {
		let destIsFile = await shutil.isfile(dest)
		if (opts.override || !destIsFile){
			await fsp.copyFile(src, dest)
			if (remove) await fsp.unlink(src)
		}else{
			let srcFileName = path.basename(src)
			let destFileName = path.basename(dest)
			if (srcFileName !== destFileName){
				await fsp.copyFile(src, dest)
				if (remove) await fsp.unlink(src)
			}
		}
	},

	__copy: async (src, dest, opts = {}, remove = false) => {		
		let srcIsFile = await shutil.isfile(src)
		let destIsFile = await shutil.isfile(dest)
		if (opts.aswhole){
			opts.aswhole = false
			let wdir = _.last(src.split(sep))
			shutil.__copy(src, `${dest}${sep}${wdir}`, opts, remove)
			return
		}

		if (destIsFile){
			if (!srcIsFile){
				throw new Error(`Can not move a dir from ${src} to a file ${dest}`)
			}
			await shutil.__copyFile(src, dest, opts, remove)
		}else{
			await shutil.mkdirp(dest)
			if (srcIsFile){
				let srcFileName = path.basename(src)
				await fsp.copyFile(src, `${dest}${sep}${srcFileName}`)
				if (remove) await fsp.unlink(src)
			}else{
				for (let fd of await shutil.listdir(src)){
					let subSrc = `${src}${sep}${fd}`
					let subDest = `${dest}${sep}${fd}`
					if (await shutil.isfile(subSrc)){
						await shutil.__copyFile(subSrc, subDest, opts, remove)
					}else{
						await shutil.__copy(subSrc, subDest, opts, remove)
					}					
				}
				if (remove) {
					//if not override, something maybe not all removed.
					await fsp.rmdir(src).catch(()=>{})
				}
			}			
		}		
	},

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
	move: async (src, dest, opts = {}) => {
		src = src.replace(/\\/g, `/`)
		dest = dest.replace(/\\/g, `/`)
		await shutil.__copy(src, dest, opts, true)
	},

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
	copy: async (src, dest, opts = {}) => {
		src = src.replace(/\\/g, `/`)
		dest = dest.replace(/\\/g, `/`)
		await shutil.__copy(src, dest, opts, false)
	},

	/**
	 * Check a dir/file is exists (or accessable)
	 * @argument
	 * 		{src}:string the path to check
	 * @returns
	 * 		{Promise}: fulfilled with true is the `src` path is exists, otherwise false.
	 */
	exists: async (src) => {
		try{
			await fsp.access(src)
			return true
		}catch(err){
			return false
		}
	},

	/**
	 * List all files/dirs contains in `src` path
	 * @argument
	 * 		{src}:string the path to list
	 * @returns
	 * 		{Promise}: fulfilled with a name list; if the `src` is not a exists directory, fulfilled with empty array `[]`
	 * @short
	 * 		exactly same as `shutil.ls`
	 */
	listdir: async (src) => {
		try{
			return await fsp.readdir(src)
		}catch(err){
			return []
		}
	},

	/**
	 * Check `src` path is exist as a directory
	 * @argument
	 * 		{src}:string the path
	 * @returns
	 * 		{Promise}: fulfilled with true if `src` is a exist directory , otherwise false
	 */
	isdir: async (src) => {
		try{
			let stat = await fsp.stat(src)
			return stat.isDirectory()
		}catch(err){
			return false
		}
		
	},

	/**
	 * Check `src` path is exist as a file
	 * @argument
	 * 		{src}:string the path
	 * @returns
	 * 		{Promise}: fulfilled with true if `src` is a exist file , otherwise false
	 */
	isfile: async (src) => {
		try{
			let stat = await fsp.stat(src)
			return stat.isFile()
		}catch(err){
			return false
		}		
	}
}

//Short Alias
shutil.mv = shutil.move
shutil.cp = shutil.copy
shutil.ls = shutil.listdir
shutil.rd = shutil.rmtree
shutil.md = shutil.mkdirp

module.exports = _.pickBy(shutil, (v, k) => !k.startsWith("_"))