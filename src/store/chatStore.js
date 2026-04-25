/**
 * @file Chat Store
 * @description チャットセッションおよびメッセージ履歴のグローバル状態管理
 * @create 2026-04-18
 */

import { createStoreSharedState } from './storage';
import { summaryMessage, sendMessage, updateUserImage } from '@/api/chatApi';
import {getSubSettingStore, isReady, languageMap} from './settingStore'
import createSharedState from 'react-cross-component-state';
import * as speech from '@/utils/speech'

export const chatSettingStore=getSubSettingStore('ChatBot')

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

chatStore.createSession=()=>{
  const id=newId()
  chatStore.setValue(prev => ({
    ...prev,
    currentSessionId: id,
    sessions: [
      { id, title: '雑談-'+(new Date).toISOString().split('T')[0], messages: [], zipped: [], isLoading: false, isSpeaking: false},
      ...prev.sessions
    ]
  }))
  chatStore.sendMessage('hi')
}

chatStore.isSettingReady=()=>{
  return isReady(chatSettingStore)
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
  const {zipped}=chatStore.getSessionById(id)
  if(zipped.length>1) {
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

chatStore.sendMessage=async (content)=>{
  const sessionId=chatStore.getValue().currentSessionId
  const session=chatStore.getSessionById(sessionId)
  if (!session || !content.trim()) return;
  let msgId=undefined

  try{

    const isStartMessage=session.messages.length==0

    const userMsg = { role: 'user', content };
    if(!isStartMessage) {
      chatStore.addMessage(sessionId, userMsg);
    }

    const history=[
      {role: 'system', content: userImage.getValue().profile},
      ...session.zipped.map(m => ({ role: m.role, content: m.content }))
    ].filter(c=>c.content)

    msgId=chatStore.addMessage(sessionId, { role: 'system', content: '', isLoading: true, isSpeaking: true })
    chatStore.updateSessionById(sessionId, {isLoading: true})

    const Speaker=speech.getSpeaker()
    let _final=null
    await sendMessage(history, ({content: txt, err}, ctx)=>{
      if(!txt) return;
      ctx.msg=ctx.msg || ''
      ctx.msg+=txt
      chatStore.updateMessage(sessionId, msgId, {
        content: ctx.msg,
      })
      const languageSetting = chatSettingStore.getValue()?.language || '日本語';
      const lang = languageMap[languageSetting] || 'ja-JP';
      _final=Speaker.speakStream(ctx.msg, lang)
    })
    Promise.resolve(_final).then(()=>{
      chatStore.updateMessage(sessionId, msgId, {
        isSpeaking: false,
      })
    })
    chatStore.updateMessage(sessionId, msgId, {
      isLoading: false,
    })
    chatStore.updateSessionById(sessionId, {isLoading: false})

    await chatStore.zipMessages(sessionId)
    await chatStore.checkUserImage(sessionId)

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
  chatStore.setValue(prev => ({
    ...prev,
    sessions: [...prev.sessions.map(session=>{
      if(session.id===sessionId) {
        session.messages.push(message)
        session.zipped.push(message)
      }
      return session
    })]
  }))
  return message.id
}

function updateMessageById(messages, msgId, msg) {
  for(let i=0; i<messages.length; i++) {
    if(messages[i].id!==msgId) continue
    Object.assign(messages[i], msg)
    messages[i]={...messages[i]}
    return [...messages]
  }
}
chatStore.updateMessage=(sessionId, msgId, msg) => {
  chatStore.updateSessionById(sessionId, session=>{
    if(session.id===sessionId) {
      session.messages=updateMessageById(session.messages, msgId, msg)
      session.zipped=updateMessageById(session.zipped, msgId, msg)
    }
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
