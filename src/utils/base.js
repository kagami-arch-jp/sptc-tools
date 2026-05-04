export function sleep(t) {
  return new Promise(r=>setTimeout(r, t))
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('コピーしました！');
  } catch (e) {
    alert('コピーに失敗しました');
  }
};

export function debounce(fn, interval) {
  let t=0
  return (...x)=>{
    clearTimeout(t)
    t=setTimeout(()=>fn(...x), interval)
  }
}

export function debounceThrottle(fn, debounceInterval, throttleInterval) {
  let throttle_t=0, debounce_t=0
  return (...x)=>{
    clearTimeout(debounce_t)
    if(Date.now()-throttle_t>=throttleInterval) {
      fn(...x)
      throttle_t=Date.now()
    }else{
      debounce_t=setTimeout(()=>fn(...x), debounceInterval)
    }
  }
}

export function newId() {
  return (Date.now()+Math.random()).toString(36)
}
