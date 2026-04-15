import createSharedState from 'react-cross-component-state';
import {debounceThrottle} from '@/utils/base'
import {saveToStorage} from '@/api/storage'

export const initialStoreValues=createSharedState({})
const shouldInitialStores=[]

export function updateValues(values) {
  for(let [setValue, key] of shouldInitialStores) {
    if(values.hasOwnProperty(key)) {
      setValue(values[key])
    }
  }
}

export function createStoreSharedState(key, initialValue) {
  const storeValue=initialStoreValues.getValue()?.[key]
  const store=createSharedState(storeValue || initialValue)
  const originalSetValue=store.setValue
  if(!storeValue) {
    shouldInitialStores.push([originalSetValue, key])
  }
  const _save=debounceThrottle(()=>{
    saveToStorage(key, store.getValue())
  }, 5e2, 5e3)
  store.setValue=value=>{
    originalSetValue(value)
    _save()
  }
  return store
}
