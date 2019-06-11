"use strict"

const should = require("should")
const shutil = require("../index")
const fsp = require('fs').promises

const ROOT = "./test/sample"

describe("all", ()=> {
	it("custom", async () => {
		//do what you want.
	}),

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
		await shutil.rmtree(ROOT)
		await shutil.copy("./test/walk_data", `${ROOT}`)
		await shutil.md(`${ROOT}/a/b/d`)
		await shutil.md(`${ROOT}/e/f`)
		
		let fds = await shutil.walk(`${ROOT}`)	

		fds.should.deepEqual([
			[ './test/sample/a/b', [ 'd' ], [ 'fa' ] ],
			[ './test/sample/a', [ 'b' ], [] ],
			[ './test/sample/c', [], [ 'ca' ] ],
			[ './test/sample/e', [ 'f' ], [] ],
			[ './test/sample', [ 'a', 'c', 'e' ], [] ]
		])
		
	})

	it("exists", async () => {
		;(await shutil.exists(".")).should.be.true()
		;(await shutil.exists("./can_never_really_exists")).should.be.false()
	})
	
	it("isdir", async () => {
		;(await shutil.isdir(".")).should.be.true()
		;(await shutil.isdir("./can_never_really_exists")).should.be.false()

		await shutil.mkdirp(ROOT)
		await fsp.writeFile(`${ROOT}/text`, "This is a test file.")
		;(await shutil.isdir(`${ROOT}/text`)).should.be.false()
	})

	it("isfile", async () => {
		;(await shutil.isfile(".")).should.be.false()
		;(await shutil.isfile("./can_never_really_exists")).should.be.false()

		await shutil.mkdirp(ROOT)
		await fsp.writeFile(`${ROOT}/text`, "This is a test file.")
		;(await shutil.isfile(`${ROOT}/text`)).should.be.true()
	})

	it("listdir", async () => {
		await shutil.rmtree(ROOT)
		await shutil.mkdirp(`${ROOT}/a`)
		await shutil.mkdirp(`${ROOT}/b`)

		let fds = await shutil.listdir(ROOT)
		fds[0].should.equal("a")
		fds[1].should.equal("b")
	})

	it("copy", async () => {
		await shutil.rmtree(ROOT)
		await shutil.mkdirp(`${ROOT}/a`)
		await shutil.mkdirp(`${ROOT}/b`)
		let content_in_a = "This is a test file."
		await fsp.writeFile(`${ROOT}/a/text`, content_in_a)

		//copy file to dir
		;(await shutil.isfile(`${ROOT}/b/text`)).should.be.false()
		await shutil.copy(`${ROOT}/a/text`, `${ROOT}/b`)
		;(await shutil.isfile(`${ROOT}/b/text`)).should.be.true()

		//copy file to file : no override
		let content_in_a_changed = "File Changed."
		await fsp.writeFile(`${ROOT}/a/text`, content_in_a_changed)
		await shutil.copy(`${ROOT}/a/text`, `${ROOT}/b/text`)
		let content_in_b = await fsp.readFile(`${ROOT}/b/text`)
		content_in_b.toString().should.equal(content_in_a)
		content_in_b.toString().should.not.equal(content_in_a_changed)

		//copy file to file : override
		await shutil.copy(`${ROOT}/a/text`, `${ROOT}/b/text`, {override: true})
		content_in_b = await fsp.readFile(`${ROOT}/b/text`)
		content_in_b.toString().should.not.equal(content_in_a)
		content_in_b.toString().should.equal(content_in_a_changed)

		//copy dir to file
		await shutil.copy(`${ROOT}/a`, `${ROOT}/b/text`).should.be.rejected()

		//copy dir to dir
		await shutil.copy(`${ROOT}/a`, `${ROOT}/c`)
		;(await shutil.isfile(`${ROOT}/c/text`)).should.be.true()

		//copy dir to dir : no override
		let content_in_a_changed_again = "File Changed Again."
		await fsp.writeFile(`${ROOT}/a/text`, content_in_a_changed_again)
		await shutil.copy(`${ROOT}/a`, `${ROOT}/c`)
		let content_in_c = await fsp.readFile(`${ROOT}/c/text`)
		content_in_c.toString().should.not.equal(content_in_a_changed_again)

		//copy dir to dir : override
		await shutil.copy(`${ROOT}/a`, `${ROOT}/c`,  {override: true})
		content_in_c = await fsp.readFile(`${ROOT}/c/text`)		
		content_in_c.toString().should.equal(content_in_a_changed_again)

		//copy tree test
		await shutil.copy(ROOT, `${ROOT}/../mirror`,  {override: true})

		await shutil.rmtree(ROOT)
		await shutil.rmtree(`${ROOT}/../mirror`)
	})

	it("move", async () => {
		await shutil.rmtree(ROOT)
		await shutil.mkdirp(`${ROOT}/a`)
		await shutil.mkdirp(`${ROOT}/b`)
		let content_in_a = "This is a test file."
		await fsp.writeFile(`${ROOT}/a/text`, content_in_a)

		//move file to dir
		;(await shutil.isfile(`${ROOT}/b/text`)).should.be.false()
		await shutil.move(`${ROOT}/a/text`, `${ROOT}/b`)
		;(await shutil.isfile(`${ROOT}/b/text`)).should.be.true()
		;(await shutil.isfile(`${ROOT}/a/text`)).should.be.false()

		//move file to file : no override
		let content_in_a_changed = "File Changed."
		await fsp.writeFile(`${ROOT}/a/text`, content_in_a_changed)
		await shutil.move(`${ROOT}/a/text`, `${ROOT}/b/text`)
		let content_in_b = await fsp.readFile(`${ROOT}/b/text`)
		;(await shutil.isfile(`${ROOT}/a/text`)).should.be.true()
		content_in_b.toString().should.not.equal(content_in_a_changed)

		//move file to file : override
		await shutil.move(`${ROOT}/a/text`, `${ROOT}/b/text`, {override: true})
		;(await shutil.isfile(`${ROOT}/a/text`)).should.be.false()
		content_in_b = await fsp.readFile(`${ROOT}/b/text`)
		content_in_b.toString().should.equal(content_in_a_changed)

		//move dir to file
		await shutil.move(`${ROOT}/a`, `${ROOT}/b/text`).should.be.rejected()

		//move dir to dir
		await shutil.move(`${ROOT}/b`, `${ROOT}/c`)
		;(await shutil.isdir(`${ROOT}/c`)).should.be.true()
		;(await shutil.isdir(`${ROOT}/b`)).should.be.false()
		;(await shutil.isfile(`${ROOT}/c/text`)).should.be.true()
	})

	it("clean", async () => {
		await shutil.rd(ROOT)
	})
})