<?js

async function resolvePOSTData() {
	return new Promise(resolve=>{
		if(!($_RAW_REQUEST.headers['content-length'] > 0)) {
			resolve(null)
			return
		}
		const buf=[]
		$_RAW_REQUEST
		  .on('data', c=>buf.push(c))
		  .on('end', ()=>resolve(Buffer.concat(buf)))
			.on('error', ()=>resolve(null))
	})
}

const __SSR_PAYLOAD_TIMEOUT__=1e3

class LibSSR{

  getDistDir() {
    return __IS_DEV__? (__DEV_WWW_DIR__+'/dist'): (__WWW_DIR__+'/app')
  }

  timelimitQuery(query) {
    return Promise.race([query, Utils.sleep(__SSR_PAYLOAD_TIMEOUT__, query)])
  }

  buildContext() {
    const exports={}
    const self={module: {exports}, require}

    const NOOP=function() {}
    Object.assign(self, {
      window: self,

			innerWidth: 1024,
			innerHeight: 768,

      addEventListener: NOOP,
      WebSocket: NOOP,
      setInterval: NOOP,
      setTimeout: NOOP,
			clearTimeout: NOOP,
			clearInterval: NOOP,
      self,

			queueMicrotask,
    })

    const location={}
    const navigator={}
    const document={}
    Object.assign(self, {location, navigator, document})
    const href='http://'+$_RAW_REQUEST['headers']['host']+$_RAW_REQUEST['url']
    location.href=href
    ; [, location.pathname, location.search]=href.match(/:\/\/[^/]+([^\?]+)(.*)/)
    navigator.userAgent=$_RAW_REQUEST['headers']['user-agent'] || 'unknown'
    document.cookie=$_RAW_REQUEST['headers'].cookie || ''

    self.callServerApi=async (action, data)=>{
      const {resolve, execute}=include(__ROUTER__)
			const w=await execute(action, {ssrQueryData: data})
			return w?.data
    }

    if(__IS_DEV__) self.console=console

    return self
  }

  getVm() {
    const filename=this.getDistDir()+'/server.js'
    return Utils.compileFile(filename, {
      compileFunc: source=>{
        const vm=require('vm')
        const path=require('path')
        const fn=path.resolve(filename)
        return new vm.Script(source, fn)
      },
      customCache: (Application.ssrVmCache=Application.ssrVmCache || {}),
    })
  }

	getAssets() {
		const path=require('path')
		const assets_fn=path.resolve(this.getDistDir()+'/assets.json')
		const assets=require(assets_fn)
		if(__IS_DEV__) delete require.cache[assets_fn]
		return assets
	}

  async render(disableSSR=false) {

		const IS_FORCE_CSR=disableSSR || $_QUERY.force_csr==='1'

		const data={
			host: $_RAW_REQUEST.headers.host.replace(/\:\d+/g, ''),
			dev_port: (process.argv.find(x=>x.indexOf('DEV_PORT=')>-1)||'').match(/\d+|$/)[0] || 3000,
			ssrData: {
				degradeCsr: IS_FORCE_CSR,
				payload: null,
			},
			ssrHTML: '',
			js: [],
			css: [],
		}

		try{
			if(IS_FORCE_CSR) {
				data.ssrData.degradeCsr=true
			}else{
				const ctx=this.buildContext()
				this.getVm().runInNewContext(ctx)
				const srvModule=ctx.module.exports
				data.ssrData.payload=await this.timelimitQuery(srvModule.init())
				data.ssrHTML=srvModule.renderToString()
			}
		}catch(e) {
			data.ssrData.degradeCsr=true
			if(__IS_DEV__) console.log(e)
		}

    const {js, css}=this.getAssets()

		if(!__IS_DEV__) {
  	  data.css.push(...css.map(p=>`/assets/app/${p}`))
			data.js.push(...js.map(p=>`/assets/app/${p}`))
		}else{
			data.css.push(...css)
			data.js.push(...js)
		}

    include(__dirname+'/ssr.html.s', data)

  }
}
