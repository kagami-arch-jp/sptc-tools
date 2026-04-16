import createSharedState from 'react-cross-component-state';

const modals = createSharedState({});

export function registerId(id, open, close) {
  modals[id]={open, close}
  return ()=>{
    delete modals[id]
  }
}

export function openById(id) {
  modals[id]?.open?.()
}
