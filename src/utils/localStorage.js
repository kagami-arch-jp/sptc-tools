import createSharedState from 'react-cross-component-state';
import {debounceThrottle} from './base'

export function helper(key) {
  return {
    setValue: newValue=>{
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    getValue: defaultValue=>{
      try{
        const p=localStorage.getItem(key)
        if(!p) throw p
        return JSON.parse(p)
      }catch(e) {
        return defaultValue
      }
    }
  }
}

export function createStoreSharedState(key, initialValue) {
  const storageHelper=helper(key)
  const store=createSharedState(storageHelper.getValue(initialValue))
  const originalSetValue=store.setValue
  const _save=debounceThrottle(()=>{
    storageHelper.setValue(store.getValue())
  }, 5e2, 5e3)
  store.setValue=value=>{
    originalSetValue(value)
    _save()
  }
  window.addEventListener('storage', e=>{
    if(e.key!==key) return;
    if(e.oldValue===e.newValue) return;
    try{
      originalSetValue(JSON.parse(e.newValue))
    }catch(err) {}
  })
  return store
}
