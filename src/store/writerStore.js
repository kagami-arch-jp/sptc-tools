/**
 * @file Writer Store
 * @description ライターセッションのグローバル状態管理
 * @create 2026-04-18
 */

import { createStoreSharedState } from './storage';
import { querySuggestion } from '@/api/writer';

import createSharedState from 'react-cross-component-state';
import {getCommonSettingStore} from '@/store/commonSettingStore'
import {fetchModels} from '@/api/settings'

export const settingKey='Writer-SettingsV1'
export const config=[
  {
    key: 'useApiKey',
    type: 'checkbox',
    info: 'オンライモードを有効にする',
    children: [
      {
        key: 'apiKey',
        type: 'password',
        info: 'API Key',
      }
    ]
  },
  {
    key: 'onlineModals',
    type: 'select',
    info: 'テキストモデル(online)',
    selection: async (state, oldValue)=>{
      if(oldValue?.key===state.apiKey && oldValue?.data?.length) return oldValue
      const modals=await fetchModels(state.useApiKey && state.apiKey || '/')
      return {
        key: state.apiKey,
        data: modals.map(({name})=>({name, value: name})),
      }
    },
    hide: state=>{
      return !(state.useApiKey && state.apiKey)
    },
  },
  {
    key: 'localModals',
    type: 'select',
    info: 'テキストモデル(local)',
    selection: async (state, oldValue)=>{
      if(oldValue?.data?.length) return oldValue
      const modals=await fetchModels()
      return {
        key: state.apiKey,
        data: modals.map(({name})=>({name, value: name})),
      }
    },
    hide: state=>{
      return state.useApiKey && state.apiKey
    },
  },
  {
    key: 'contextLength',
    type: 'range',
    show: value=>`${value/1024}k`,
    info: 'Context length',
    min: 8192,
    max: 131072,
    step: 4096,
  },
  {
    key: 'temperature',
    type: 'range',
    info: 'Temperature',
    min: 0,
    max: 2,
    step: 0.1,
  },
]

export const writerSettingStore=getCommonSettingStore(settingKey)

function newId() {
  return (Date.now()+Math.random()).toString(36)
}

const writerSessions = createStoreSharedState('writer_sessions', {
  sessions: [],
  selectedId: '',
});

export default writerSessions

writerSessions.setSelectedSession=(sessionId)=>{
  writerSessions.setValue(prev=>({
    ...prev,
    selectedId: sessionId,
  }))
}

writerSessions.createSession=()=>{
  const id=newId()
  const now = new Date();
  const title = now.toLocaleString();
  const newSession = {
    id,
    title,
    content: '',
    rule: '',
  };
  writerSessions.setValue(prev => ({
    ...prev,
    selectedId: id,
    sessions: [...prev.sessions, newSession],
  }))
}

writerSessions.deleteSession=(id)=>{
  writerSessions.setValue(prev => {
    const remaining = prev.sessions.filter(s => s.id !== id);
    const newSelected = remaining.length
      ? remaining[0].id
      : '';
    return { sessions: remaining, selectedId: newSelected };
  });
}

writerSessions.updateSessionById=(sessionId, nextSession)=>{
  writerSessions.setValue(prev=>({
    ...prev,
    sessions: [...prev.sessions.map(session=>{
      if(session.id!==sessionId) return session
      Object.assign(session, typeof nextSession==='function'? nextSession(session): nextSession)
      return {...session}
    })],
  }))
}

writerSessions.updateTitle=(id, newTitle)=>{
  writerSessions.updateSessionById(id, session=>{
    session.title=newTitle
  })
}

writerSessions.updateContent=(id, value)=>{
  writerSessions.updateSessionById(id, session=>{
    session.content=value
  })
}

writerSessions.updateRule=(id, value)=>{
  writerSessions.updateSessionById(id, session=>{
    session.rule=value
  })
}

writerSessions.isSettingReady=()=>{
  const v=writerSettingStore.getValue()
  return (
    v.useApiKey && v.apiKey && v.onlineModals
  ) || v.localModals || false
}

writerSessions.querySuggestion=async (txt, queryType, pos, role, onUpdate, onFinish)=>{
  const timestamp=Date.now()
  onUpdate({
    pending: true,
    timestamp,
    res: '',
    pos,
  })

  await querySuggestion({
    txt,
    role: role || '',
    queryType,
  }, ({content})=>{
    onUpdate(prevState=>{
      if(prevState.timestamp>timestamp) return prevState
      return {
        ...prevState,
        res: prevState.res+content,
      }
    })
  })

  onUpdate(prevState=>{
    if(prevState.timestamp>timestamp) return prevState
    return {
      ...prevState,
      pending: false,
    }
  })
  onFinish?.()
}
