/**
 * @file Chat Store
 * @description チャットセッションおよびメッセージ履歴のグローバル状態管理
 * @create 2026-04-18
 */

import { createStoreSharedState } from './storage';
import { summaryMessage, sendMessage, updateUserImage } from '@/api/chatApi';

import createSharedState from 'react-cross-component-state';
import * as speech from '@/utils/speech'
import {fetchModels} from '@/api/settings'

import {getCommonSettingStore} from '@/store/commonSettingStore'
import {getLanguage} from '@/store/globalSettingStore'

export const settingKey='ChatBot-SettingsV1'
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
  {
    key: 'tone',
    type: 'select',
    info: '応答トーン',
    selection: [
      {name: 'human', value: 'human'},
      {name: 'assistant', value: 'assistant'},
      {name: 'tsuxtsukomi', value: 'ツッコミ'},
    ],
  },
  {
    key: 'autoSpeak',
    type: 'checkbox',
    info: '自動朗読を有効にする',
  },
]

export const chatSettingStore=getCommonSettingStore(settingKey)

function newId() {
  return (Date.now()+Math.random()).toString(36)
}

const chatStore=createStoreSharedState('chatBot-v2', {
  sessions: [],
  currentSessionId: '',
}, ()=>{
  chatStore.setValue(prev=>({
    ...prev,
    sessions: [...prev.sessions.map(session=>{
      session.isLoading=false
      session.messages.map(msg=>{
        msg.isLoading=false
        msg.isSpeaking=false
      })
      return {...session}
    })]
  }))
});

export default chatStore

const userImage=createStoreSharedState('chatBot.userImage', {
  counter: 0,
  profile: '',
  stacks: [],
})

chatStore.setCurrentSession=(sessionId)=>{
  chatStore.setValue(prev=>({
    ...prev,
    currentSessionId: sessionId,
  }))
}

export const roleBtnList = {
  mennsetsu: {
    text: '面接官',
    description: '模擬面接练习。会話を监听し、質問します。履歴を保持して継続的な対話が可能。',
    autoSendHi: true,
    sendWithHistory: true,
    enableUserImage: true,
  },
  chat: {
    text: '会話練習',
    description: '日常的な会話練習。用户の表現をチェックし、より自然な日本語に修正します。',
    autoSendHi: true,
    sendWithHistory: true,
    enableUserImage: true,
  },
  normal: {
    text: '普通会話ツール',
    description: '一般的なチャットボット。AI アシスタントとして何でも質問できます。',
    autoSendHi: false,
    sendWithHistory: true,
    enableUserImage: true,
  },
  translate: {
    text: '日本語に翻訳',
    description: '選択したテキストを日本語に翻訳します。履歴不要みで即座に翻訳。',
    autoSendHi: false,
    sendWithHistory: false,
    enableUserImage: false,
  },
  grammer: {
    text: '文法指摘',
    description: '文章の文法をチェックし 誤用などを指摘・修正します。',
    autoSendHi: false,
    sendWithHistory: true,
    enableUserImage: false,
  },
}

chatStore.createSession=()=>{
  const id=newId()
  chatStore.setValue(prev => ({
    ...prev,
    currentSessionId: id,
    sessions: [
      { id, title: '新規チャット', messages: [], zipped: [], isLoading: false, isSpeaking: false, who: ''},
      ...prev.sessions
    ]
  }))
}

chatStore.isSettingReady=()=>{
  const v=chatSettingStore.getValue()
  return (
    v.useApiKey && v.apiKey && v.onlineModals
  ) || v.localModals || false
}

function getInitTitle(who) {
  const config = roleBtnList[who]
  const prefix = config?.text || '新規チャット'
  return prefix + '-' + (new Date).toISOString().split('T')[0]
}

chatStore.startSessionByRole=(id, who)=>{
  const config = roleBtnList[who]
  chatStore.updateSessionById(id, session=>{
    session.who=who
    session.title=getInitTitle(who)
  })
  if (config?.autoSendHi) {
    chatStore.sendMessage('hi')
  }
}

chatStore.updateSessionTitle=(id, title)=>{
  chatStore.setValue(prev=>({
    ...prev,
    sessions: prev.sessions.map(s => s.id === id ? { ...s, title } : s),
  }))
}

chatStore.getSessionById=(sessionId)=>{
  return chatStore.getValue().sessions.find(s=>s.id===sessionId)
}
chatStore.useSessionById=(sessionId)=>{
  return chatStore.useValue().sessions.find(s=>s.id===sessionId)
}

chatStore.deleteSession=(id)=>{
  const {zipped, who}=chatStore.getSessionById(id)
  if(roleBtnList[who]?.enableUserImage && zipped.length>1) {
    userImage.setValue(prev=>{
      prev.stacks=[...(prev.stacks || []), zipped]
      return {...prev}
    })
  }
  chatStore.setValue(prev=>{
    const next={
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== id),
    }
    if(next.currentSessionId===id) {
      next.currentSessionId=next.sessions[0]?.id || ''
    }
    return next
  })
}

chatStore.sendMessage=async content=>{
  const sessionId=chatStore.getValue().currentSessionId
  const session=chatStore.getSessionById(sessionId)

  if (!session || !content.trim()) return;
  let msgId=undefined

  try{

    const whoToSend=session.who
    const roleConfig = roleBtnList[whoToSend]
    const isStartMessage=session.messages.length==0 && roleConfig.autoSendHi

    const userMsg = { role: 'user', content };
    if(!isStartMessage) {
      chatStore.addMessage(sessionId, userMsg);
    }

    let history
    if (roleConfig?.sendWithHistory) {
      history=[
        roleConfig?.sendUserImage && {role: 'system', content: userImage.getValue().profile},
        ...session.zipped.map(m => ({ role: m.role, content: m.content }))
      ].filter(c=>c?.content)
    } else {
      history=[
        roleConfig?.sendUserImage && {role: 'system', content: userImage.getValue().profile},
        userMsg,
      ].filter(c=>c?.content)
    }

    history=history.map(c=>({
      role: c.role,
      content: c.role==='user'? `<Text>${c.content}</Text>`: c.content,
    }))

    msgId=chatStore.addMessage(sessionId, { role: 'system', content: '', isLoading: true, isSpeaking: false })
    chatStore.updateSessionById(sessionId, {isLoading: true})

    const Speaker=speech.getSpeaker()
    const shouldAutoSpeak = chatSettingStore.getValue().autoSpeak
    let _final=null
    await sendMessage(history, ({content, err}, ctx)=>{
      const txt=content || `Error: ${err}`
      if(!txt) return;
      ctx.msg=ctx.msg || ''
      ctx.msg+=txt
      chatStore.updateMessage(sessionId, msgId, {
        content: ctx.msg,
        isSpeaking: shouldAutoSpeak,
      })
      if (shouldAutoSpeak) {
        const lang = getLanguage()
        _final=Speaker.speakStream(ctx.msg, lang)
      }
    }, whoToSend)
    Promise.resolve(_final).then(()=>{
      chatStore.updateMessage(sessionId, msgId, {
        isSpeaking: false,
      })
    })
    chatStore.updateMessage(sessionId, msgId, {
      isLoading: false,
    })
    chatStore.updateSessionById(sessionId, {isLoading: false})

    if (roleConfig?.sendWithHistory) {
      await chatStore.zipMessages(sessionId)
    }
    if (roleConfig?.enableUserImage) {
      await chatStore.checkUserImage(sessionId)
    }

  }catch(e) {
    console.log('send message error', e)
  }finally{
    chatStore.updateMessage(sessionId, msgId, {
      isLoading: false,
    })
    chatStore.updateSessionById(sessionId, {
      isLoading: false,
    })
  }
}

chatStore.tiggerMessageSpeak=async (sessionId, message)=>{
  if(message.isSpeaking) {
    speech.stop()
    chatStore.updateMessage(sessionId, message.id, {
      isSpeaking: false
    })
  }else{
    chatStore.updateMessage(sessionId, message.id, {
      isSpeaking: true
    })
    await speech.getSpeaker().speak(message.content)
    chatStore.updateMessage(sessionId, message.id, {
      isSpeaking: false
    })
  }
}

chatStore.addMessage=(sessionId, message) => {
  message.id=newId()
  chatStore.updateSessionById(sessionId, session=>{
    session.messages.push(message)
    session.zipped.push(message)
  })
  return message.id
}

function updateMessageById(messages, msgId, msg) {
  for(let i=0; i<messages.length; i++) {
    if(messages[i].id!==msgId) continue
    Object.assign(messages[i], msg)
    messages[i]={...messages[i]}
    return [...messages]
  }
  return messages
}
chatStore.updateMessage=(sessionId, msgId, msg) => {
  chatStore.updateSessionById(sessionId, session=>{
    session.messages=updateMessageById(session.messages, msgId, msg)
    session.zipped=updateMessageById(session.zipped, msgId, msg)
  })
}

chatStore.updateSessionById=(sessionId, nextSession)=>{
  chatStore.setValue(prev=>({
    ...prev,
    sessions: [...prev.sessions.map(session=>{
      if(session.id!==sessionId) return session
      Object.assign(session, typeof nextSession==='function'? nextSession(session): nextSession)
      return {...session}
    })],
  }))
}

chatStore.zipMessages=async (sessionId, option)=> {
  const {zipped}=chatStore.getSessionById(sessionId) || {}
  if(!zipped) return;
  const {MIN_RAW_LEN=2, ZIP_COUNT=5}=option || {}
  if(zipped.length < MIN_RAW_LEN+ZIP_COUNT) return;
  const zip=zipped.slice(0, ZIP_COUNT)
  const keep=zipped.slice(ZIP_COUNT)
  const {str: summary}=await summaryMessage(zip, ({content: txt, err}, ctx)=>{
    ctx.str=ctx.str || ''
    ctx.str+=txt || ''
  })
  chatStore.updateSessionById(sessionId, session=>{
    session.zipped=[
      {role: 'system', content: `<Summary>\n${summary}\n</Summary>`},
      ...keep
    ].filter(Boolean)
  })
}

chatStore.deleteMessage=(sessionId, msgId)=>{
  chatStore.updateSessionById(sessionId, session=>{
    session.messages=session.messages.filter(msg=>msg.id!==msgId)
    session.zipped=session.zipped.filter(msg=>msg.id!==msgId)
  })
}

chatStore.checkUserImage=async (sessionId, updateUserImageCount=2)=>{
  userImage.setValue(prev=>{
    return {...prev, counter: (prev.counter+1)%updateUserImageCount}
  })
  const {counter, stacks, profile}=userImage.getValue()
  async function _generate(zipped) {
    const {newProfile}=await updateUserImage([
      ...zipped,
      {role: 'system', content: profile},
    ], ({content: txt, err}, ctx)=>{
      ctx.newProfile=ctx.newProfile || ''
      ctx.newProfile+=txt || ''
    })
    const _newProfile=newProfile.match(/<UserImage>\s*([\s\S]+?)\s*<\/UserImage>|$/)[1] || ''
    if(!_newProfile) throw new Error('failed to update userImage')
    return `<UserImage>\n${_newProfile}\n</UserImage>`
  }
  if(stacks.length) {
    const zipped=stacks.shift()
    try{
      const newProfile=await _generate(zipped)
      userImage.setValue(prev=>{
        prev.stacks=prev.stacks.filter(v=>v!==zipped)
        return {...prev, profile: newProfile}
      })
    }catch(e) {
      stacks.unshift(zipped)
    }
  }else if(counter===0) {
    const {zipped}=chatStore.getSessionById(sessionId) || {}
    if(zipped.length<3) return;
    try{
      const newProfile=await _generate(zipped)
      userImage.setValue(prev=>{
        return {...prev, profile: newProfile}
      })
    }catch(e) {}
  }
}
