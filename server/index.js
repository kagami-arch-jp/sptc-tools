#!/usr/bin/env node

const {name, version}=require(__dirname+'/package.json')

process.env.ENV='PROD'

const {FastCGI}=require('sptc/dist/httpServer')

async function getAvailablePort() {
  const net = require('net');
  function isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  }
  for(let i=9090; i<65535; i++) {
    if(await isPortAvailable(i)) return i
  }
  throw new Error('no available port')
}

; (async ()=>{
  const port=await getAvailablePort()
  const workdir=__dirname

  FastCGI(port, false, {
    serverDir: workdir,
    routerEntry: 'index.s',
    debug: true,
    traverse: false,
  })

  const {getLocalIpv4Addresses}=require('sptc/utils')
  console.log(`-- ${name} v${version} --`)
  console.log(`workdir=${workdir}`)
  console.log(`server:`)
  for(const ip of getLocalIpv4Addresses()) {
    console.log('  http://'+ip+':'+port)
  }

  require('open').default('http://127.0.0.1:'+port)

})()
