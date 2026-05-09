const APP_PATH=__dirname+'/..'
const pkg=require(APP_PATH+'/package.json')
const chalk=require('chalk')
const fs=require('fs')

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
  for(let i=19090; i<65535; i++) {
    if(await isPortAvailable(i)) return i
  }
  throw new Error('no available port')
}

const RUNTIME_RND_STR=Date.now().toString(36)
function getRuntimeArgv() {
  const p=process.argv[2]
  const IS_DEV=p==='dev'
  const IS_BUILD=p==='build'

  return {
    IS_DEV,
    IS_BUILD,
    RND: RUNTIME_RND_STR,
  }
}

function satisfiesVersion(target_v, custom_v) {
  function _cmp(v1, v2, g=3) {
    v1=v1.split('.').slice(0, g)
    v2=v2.split('.').slice(0, g)
    for(;v1.length<3;) v1.push(0)
    for(;v2.length<3;) v2.push(0)
    for(let i=0; i<3; i++) {
      const _v1=parseInt(v1[i]) || 0, _v2=parseInt(v2[i]) || 0
      if(_v1>_v2) return 1
      if(_v1<_v2) return -1
    }
    return 0
  }
  if(target_v==='*' || target_v===custom_v) return true
  let s=false
  target_v.replace(/^(>=|>|\^|~)\s*(\S+)/, (_, x, t_ver)=>{
    if(x==='>=') {
      s=_cmp(custom_v, t_ver)>=0
    }else if(x==='>') {
      s=_cmp(custom_v, t_ver)>0
    }else if(x==='<=') {
      s=_cmp(custom_v, t_ver)<=0
    }else if(x==='<') {
      s=_cmp(custom_v, t_ver)<0
    }else if(x==='^' || x==='~') {
      s=_cmp(custom_v, t_ver)>=0
      if(x==='^') {
        s=s && _cmp(custom_v, t_ver.replace(/^\d+/, _=>+_+1), 1)<=0
      }else{
        s=s && _cmp(custom_v, t_ver.replace(/(^.+?\.)(\d+)/, (_, a, b)=>a+(+b+1)), 2)<=0
      }
    }
  })
  return s
}

function checkEnv() {
  if(!satisfiesVersion(pkg.engines.node, process.version.replace(/^v/, ''))) {
    console.log([
      chalk.red('Node version not met :('),
      chalk.yellow(`You are using Node ${process.version}. Node ${pkg.engines.node} is required.`),
    ].join('\n'))
    process.exit(1)
  }

  const unmatched=[]
  const t=Object.assign({}, pkg.dependencies, pkg.devDependencies)
  for(let n in t) {
    let custom_v=''
    try{
      custom_v=require(APP_PATH+'/node_modules/'+n+'/package.json').version
    }catch(e) {}
    if(satisfiesVersion(t[n], custom_v)<=0) {
      unmatched.push([n, t[n], custom_v])
    }
  }
  if(unmatched.length) {
    console.log(chalk.red(`The following packages should be installed:`))
    for(let [name, tv, cv] of unmatched) {
      console.log(`${name} required: ${tv} | current: ${cv || 'uninstalled'}`)
    }
    process.exit()
  }
}

function run(exe, argv) {
  const p=require('child_process').spawn(
    require('os').platform()==='win32'? exe+'.cmd': exe, argv)
  p.stdout.on('data', b=>process.stdout.write(b))
  p.stderr.on('data', b=>process.stderr.write(b))
}

module.exports={
  APP_PATH,
  getRuntimeArgv,
  checkEnv,
  run,
  getAvailablePort,
}
