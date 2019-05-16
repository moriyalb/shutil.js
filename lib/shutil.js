"use strict"

const fsp = require("fs").promises

//use linux sep.
const sep = "/" 

let shutil = module.exports = {
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

	//todo, make the generator version
	walk: async (src) => {
		src = src.replace(/\\/g, `/`)
		try {
			await fsp.access(src)
			let all = await fsp.readdir(src)
			let dirs = []
			let files = []
			let result = []
			for (let fd of all){
				let fpath = [src, fd].join(sep)
				let stat = await fsp.stat(fpath)
				if (stat.isDirectory()) { // recurse
					dirs.push(fd)
					let subs = await shutil.walk(fpath)
					if (!!subs) result = result.concat(subs)
				} else { // delete file
					files.push(fs)
				}
			}		
			result.push([src, dirs, files])
			return result
		}catch(err){
			
		}
	},

	copy: async (src, dest) => {
		//later
	},

	move: async (src, dest) => {
		//later
	},

	exists: async (src) => {
		try{
			await fsp.access(src)
			return true
		}catch(err){
			return false
		}
	}
}