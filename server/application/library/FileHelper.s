<?js

const fs=require('fs')

class FileHelper{
	static existsDir(dir) {
		try{
			return fs.statSync(dir).isDirectory()
		}catch(e) {
			return false
		}
	}

	static mkdirSync(dir) {
		try{
  		fs.mkdirSync(dir)
		}catch(e) {
			return false
		}
	}

	static existsFile(fn) {
		try{
			return fs.statSync(fn).isFile()
		}catch(e) {
			return false
		}
	}

	static walkDir(dir, filter) {
		const ret=[]
		const ls=(dir, stack=[])=>{
		  for(let x of fs.readdirSync(dir)) {
				const fn=dir+'/'+x
				const isDir=FileHelper.existsDir(fn)
				if(!filter(x, isDir)) continue
				if(isDir) {
					stack.push(fn)
				}else{
					ret.push(fn)
				}
			}
			if(stack.length) {
				ls(stack.pop(), stack)
			}
		}
		ls(dir)
		return ret.map(fn=>fn.substr(dir.length+1)).sort()
	}

	static readTextFile(fn) {
	  return fs.readFileSync(fn, 'utf8')
	}

	static writeFile(fn, data) {
		return fs.writeFileSync(fn, data)
	}

}
