<?js

// const POSTDATA_MAXSIZE=50e3

async function resolvePOSTData() {
	return new Promise(resolve=>{
		/*
		if(!($_RAW_REQUEST.headers['content-length'] <= POSTDATA_MAXSIZE)) {
			resolve(null)
			return
		}
		*/
		const buf=[]
    let size=0
		$_RAW_REQUEST
		  .on('data', c=>{
        // if(size>POSTDATA_MAXSIZE) return;
        buf.push(c)
        size+=c.length
      })
		  .on('end', ()=>{
        try{
          resolve(JSON.parse(Buffer.concat(buf).toString()))
        }catch(e) {
          resolve(null)
        }
      })
			.on('error', ()=>resolve(null))
	})
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
  finish(err, ret) {

		if(this.isStream) {
			// if(err) echo(err?.message || err)
			// else echo('\n\ndone.')
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
