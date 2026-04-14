
function clientFetch(action, data) {
  if("@IS_DEV") {
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

export async function fetchStream(action, data, onData) {
  const response = await clientFetch(action, data)

  // Network‑level error handling
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} - ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const reader = response.body.getReader()
  const dec=new TextDecoder()
  for(let head='', skip=false;;) {
    const {done, value}=await reader.read()
    if(value) {
      const txt=dec.decode(value)
      if(!skip) {
        head+=txt
        if(head.length>=4096) {
          onData(head.substr(4096))
          skip=true
        }
      }else{
        onData(txt)
      }
    }
    if(done) break
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
export function resolveFragment(fn) {
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
