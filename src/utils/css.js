export function cls(...x) {
  if(x.length===1 && typeof x==='object') {
    let r=[]
    for(let key in x[0]) {
      if(x[0][key]) r.push(key)
    }
    return r.join(' ')
  }
  return x.filter(Boolean).join(' ')
}
