"use strict"

const should = require("should")
const shutil = require("../index")
const fsp = require('fs').promises

const ROOT = "./test/sample"

describe("all", ()=> {
	it("mkdirp" , async () => {
		let dir_deep = `${ROOT}/a/b/c/d`
		await shutil.mkdirp(dir_deep)
		await fsp.stat(dir_deep).should.be.fulfilled()
		//or
		;(await shutil.exists(dir_deep)).should.be.true()
	})

	it("rmtree" , async () => {
		let dir_deep = `${ROOT}/a`	
		await shutil.mkdirp(dir_deep)
		await shutil.rmtree(dir_deep)
		fsp.access(dir_deep).should.be.rejected()
		//or
		;(await shutil.exists(dir_deep)).should.be.false()
	})
	
	it("walk", async () => {
		let dir_deep = `${ROOT}/a/b/c`
		await shutil.rmtree(dir_deep)
		await shutil.mkdirp(dir_deep)
		let fds = await shutil.walk(`${ROOT}`)		

		fds[0][0].should.equal("./test/sample/a/b/c")
		fds[0][1].should.deepEqual([])
		fds[0][2].should.deepEqual([])

		fds[1][0].should.equal("./test/sample/a/b")
		fds[1][1].should.deepEqual(['c'])
		fds[1][2].should.deepEqual([])

		fds[2][0].should.equal("./test/sample/a")
		fds[2][1].should.deepEqual(['b'])
		fds[2][2].should.deepEqual([])
		
		fds[3][0].should.equal("./test/sample")
		fds[3][1].should.deepEqual(['a'])
		fds[3][2].should.deepEqual([])
	})
})

process.on('uncaughtException', (err) => {
	console.error(`<Master Exception>:` + err.stack)
})

process.on('unhandledRejection', (reason, p) => {
	console.error(`<Master Rejection>:`, p, ' reason:', reason)
})