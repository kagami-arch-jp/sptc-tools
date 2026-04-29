#!/usr/bin/env node

const {name, version}=require(__dirname+'/package.json')

process.env.ENV='PROD'

const {FastCGI}=require('sptc/dist/httpServer')

const port=9090
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

require('open').default('http://127.0.0.1:9090')
