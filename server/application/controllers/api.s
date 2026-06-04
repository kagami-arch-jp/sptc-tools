<?js

const {formidable} = require('formidable')
const path=require('path')
const mime = require('mime-types')

async function resolvePOSTData() {
  const ct = ($_RAW_REQUEST.headers['content-type'] || '').toLowerCase()

  if (ct.includes('application/json')) {
    return new Promise(resolve => {
      const buf = []
      $_RAW_REQUEST
        .on('data', c => buf.push(c))
        .on('end', () => {
          try { resolve(JSON.parse(Buffer.concat(buf).toString())) }
          catch { resolve(null) }
        })
        .on('error', () => resolve(null))
    })
  }

  if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
    return new Promise(resolve => {
      const form = formidable({ multiples: true, maxFileSize: 50 * 1024 * 1024 })
      form.parse($_RAW_REQUEST, (err, fields, files) => {
        if (err) return resolve(null)
        resolve({ ...fields, ...files })
      })
    })
  }

  return null
}

class apiController{
  async init(argv) {
    const ssrParam=argv?.arguments?.[0]
		this.postData=await resolvePOSTData()
    this.ssrQueryData=ssrParam?.ssrQueryData || this.postData || null
    this.isSSR=!!ssrParam
  }
  setAsStreamResponse() {
		this.isStream=true
		echo(' '.repeat(4096))
		flush()
	}
  sendFile(filepath) {
    const mimeType = mime.lookup(path.extname(filepath)) || 'application/octet-stream'
    this.isSendFile=true
    sendFile(filepath, { 'content-type': mimeType })
  }
  finish(err, ret) {
    if(this.isSendFile || this.isStream) {
			return;
		}

    const res={
      success: !err,
      errMsg: err?.message || null,
      data: ret,
    }
    if(this.isSSR) {
      return res
    }else{
      setResponseHeaders({
        'content-type': 'text/json',
      })
      echo(JSON.stringify(res))
    }
  }
}
