/**
 * @file Chat Store
 * @description チャットセッションおよびメッセージ履歴のグローバル状態管理
 * @create 2026-04-18
 */

import { createStoreSharedState } from './storage';
import { summaryMessage, sendMessage, updateUserImage } from '@/api/chatApi';
import {getSubSettingStore, isReady} from './settingStore'

export const chatSettingStore=getSubSettingStore('ChatBot')

// セッション情報の管理
const sessions = createStoreSharedState('chatBot.sessions', []);

const userImage = createStoreSharedState('chatBot.userImage', {
  counter: 0,
  profile: '',
  stacks: [],
})

// 現在選択されているセッションID
const currentSessionId = createStoreSharedState('chatBot.currentSessionId', 'default-session');

function newId() {
  return (Date.now()+Math.random()).toString(36)
}

async function tryCallModal(func, msgs) {
  let str=''
  await func(msgs, txt=>{
    str+=txt
  })
  return str
}

const chatStore = {
  sessions: sessions,
  currentSessionId: currentSessionId,

  // 新規セッション作成
  createSession: () => {
    const id=newId()
    sessions.setValue(prev => [
      ...prev,
      { id, title: '雑談-'+(new Date).toISOString().split('T')[0], messages: [], summariedMessages: []}
    ]);
    currentSessionId.setValue(id);
    chatStore.sendMessage('hi')
  },

  isSettingReady: ()=>{
    return isReady(chatSettingStore)
  },

  // セッション削除
  deleteSession: (id) => {
    const {summariedMessages}=chatStore.getSessionById(id)
    if(summariedMessages.length>1) {
      userImage.setValue(prev=>{
        prev.stacks=[...(prev.stacks || []), summariedMessages]
        return {...prev}
      })
    }
    sessions.setValue(prev => prev.filter(s => s.id !== id));
    if (currentSessionId.getValue() === id) {
      // 削除されたセッションが現在選択中なら、最初のセッションか新規へ
      const remaining = sessions.getValue();
      currentSessionId.setValue(remaining.length > 0 ? remaining[0].id : 'default-session');
    }
  },

  // タイトル編集
  updateSessionTitle: (id, title) => {
    sessions.setValue(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  },

  sendMessage: async content => {
    const sessionId = chatStore.currentSessionId.getValue();

    const session = chatStore.getSessionById(sessionId);
    if (!session || !content.trim()) return;

    const isStartMessage=session.messages.length==0

    const userMsg = { role: 'user', content };
    if(!isStartMessage) {
      chatStore.addMessage(sessionId, userMsg);
    }

    const history=[
      {role: 'system', content: userImage.getValue().profile},
      ...session.summariedMessages.map(m => ({ role: m.role, content: m.content })),
    ].filter(c=>c.content)
    if(!isStartMessage) history.push(userMsg)

    const msgId=chatStore.addMessage(sessionId, { role: 'system', content: '', loading: true })
    let msg=''
    await sendMessage(history, txt=>{
      msg+=txt
      chatStore.updateMessage(sessionId, msgId, {
        content: msg,
      })
    })
    chatStore.updateMessage(sessionId, msgId, {
      loading: false,
    })

  },

  // メッセージ追加
  addMessage: (sessionId, message) => {
    message.id=newId()
    sessions.setValue(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          messages: [...s.messages, message],
          summariedMessages: [...s.summariedMessages, message],
        };
      }
      return s;
    }));
    return message.id
  },

  updateMessage: (sessionId, msgId, msg) => {
    const updateMessageById=messages=>{
      for(let i=0; i<messages.length; i++) {
        if(messages[i].id!==msgId) continue
        Object.assign(messages[i], msg)
        messages[i]={...messages[i]}
        return messages[i]
      }
    }
    sessions.setValue(prev => prev.map(s => {
      if (s.id === sessionId) {
        updateMessageById(s.messages)
        const _msg=updateMessageById(s.summariedMessages)
        if(!_msg.loading) {
          chatStore.checkSummaryMessage(sessionId).
            then(()=>chatStore.checkUserImage(sessionId)).
            catch(e=>{
              console.log('failed to summarize', e)
            })
        }
        return { ...s, messages: [...s.messages] };
      }
      return s;
    }));
  },

  getSessionById: sessionId=>{
    return sessions.getValue().find(s=>s.id===sessionId)
  },

  updateSessionById: (sessionId, nextSession)=>{
    sessions.setValue(prev=>{
      const session=prev.find(s=>s.id===sessionId)
      Object(session, typeof nextSession==='function'? nextSession(session): nextSession)
      return [...prev]
    })
  },

  checkSummaryMessage: async (sessionId, maxOriginalLen=5, maxSummarizedLen=5)=> {
    const {summariedMessages}=chatStore.getSessionById(sessionId)
    const summarized=summariedMessages.filter(x=>x.summarized)
    const original=summariedMessages.filter(x=>!x.summarized)

    function updateSummary(sum=[], ori=[]) {
      chatStore.updateSessionById(sessionId, session=>{
        session.summariedMessages=[
          ...sum,
          ...summarized,
          ...ori,
          ...original
        ].filter(Boolean)
        return session
      })
    }

    let cutted=null
    if(original.length>maxOriginalLen) {
      cutted=original.splice(0, maxOriginalLen)
      const str=await tryCallModal(summaryMessage, cutted)
      updateSummary([], str?
        [{role: 'system', content: `<Summary>\n${str}\n</Summary>`, summarized: true}]:
        cutted
      )
    }else if(summarized.length>maxSummarizedLen) {
      cutted=summarized.splice(0, maxSummarizedLen)
      const str=await tryCallModal(summaryMessage, cutted)
      updateSummary(str?
        [{role: 'system', content: `<Summary>\n${str}\n</Summary>`, summarized: true}]:
        cutted
      )
    }
  },
  checkUserImage: async (sessionId, updateUserImageCount=5)=>{
    userImage.setValue(prev=>{
      return {...prev, counter: (prev.counter+1)%updateUserImageCount}
    })
    const {counter, stacks}=userImage.getValue()
    const [summarizedMessages, force]=(()=>{
      const {summariedMessages}=chatStore.getSessionById(sessionId)
      if(summariedMessages.length>3) return [summariedMessages, false]
      if(stacks.length>0) return [stacks[0], true]
    })() || []
    if(!summarizedMessages) return;
    if(counter && !force) return;

    const profile=await tryCallModal(updateUserImage, [
      ...summarizedMessages,
      {role: 'system', content: userImage.getValue().profile},
    ].filter(c=>c.content))

    if(profile) {
      userImage.setValue(prev=>{
        prev.stacks=prev.stacks.filter(v=>v!==summarizedMessages)
        return {...prev, profile: `<UserImage>\n${profile}\n</UserImage>`}
      })
    }
  },

  // セッション切り替え
  setCurrentSession: (id) => {
    currentSessionId.setValue(id);
  }
};

export default chatStore;
