import {startDance, stopDance} from './title'

function clientFetch(action, data) {
  if("@IS_DEV"==="true") {
    action=location.origin+action
  }
  return window.fetch(action, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    mode: 'cors',
    body: JSON.stringify(data),
    credentials: 'include',
  })
}

#ifndef IS_NODE_TARGET
import {sleep} from './base'

const FETCH_TIMEOUT=10e3

async function _fetch(action, data) {
  const ret=await Promise.race([
    clientFetch(action, data),
    sleep(FETCH_TIMEOUT).then(_=>new Error('Network hung up')),
  ])
  return await ret.json()
}

#else

function _fetch(action, data) {
  return callServerApi(action, data)
}

#endif

export async function fetch(action, data) {
  try{
    const ret=await _fetch(action, data)
    if(!ret.success) throw new Error(ret.errMsg)
    return ret.data
  }catch(e) {
    throw e
  }
}

export async function fetchStream({ action, data, onData, abortHandler, disableDance }) {
  try{
    if(!disableDance) startDance()
    const response = await clientFetch(action, data)

    // Network‑level error handling
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status} - ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    const reader = response.body.getReader()
    const dec=new TextDecoder()
    let isSuccessDone=false
    const ctx={}
    const resolver=resolveFragment(fragment=>{
      const p=JSON.parse(fragment)
      if(p.done===true) isSuccessDone=true
      else onData(p, ctx)
    })
    for(let head='', skip=false;;) {
      const {done, value}=await reader.read()
      if(abortHandler?.aborted) {
        throw new Error('fetch stream aborted')
      }
      if(value) {
        const txt=dec.decode(value)
        if(!skip) {
          head+=txt
          if(head.length>=4096) {
            const x=head.substr(4096)
            resolver(x)
            skip=true
          }
        }else{
          resolver(txt)
        }
      }
      if(done) break
    }
    if(!isSuccessDone) throw new Error('failed to load the end of stream')
    return ctx
  }catch(e) {
    throw e
  }finally{
    if(!disableDance) stopDance()
  }
}

/**
 Test:

 const e=resolveFragment(x=>console.log([x]))
 e('1cs')
 e('dc\n')
 e('2csdc\n')
 e('3cds\n')
 */
function resolveFragment(fn) {
  let stack=''
  return txt=>{
    stack+=txt
    for(;;) {
      const idx=stack.indexOf('\n')
      if(idx===-1) break
      const str=stack.substr(0, idx)
      stack=stack.substr(idx+1, stack.length)
      fn(str)
    }
  }
}
