/**
 * @file ChatBot Component
 * @description チャットボットのメインレイアウトコンポーネント
 * @create 2026-04-18
 * @usage <ChatBot />
 */

import React from 'react';
import SessionList from './SessionList';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Dialog from '@/components/Dialog';
import chatStore from '@/store/chatStore';
import './index.scss';

import {openById} from '@/store/modalButton'
import SizeObserver from '@/components/SizeObserver'

const ChatBot = () => {
  const currentSessionId = chatStore.currentSessionId.useValue();
  const sessions = chatStore.sessions.useValue();
  const currentSession = sessions.find(s => s.id === currentSessionId);

  const [editCurrentTitle, setEditCurrentTitle]=React.useState(false)
  const titleRef=React.useRef(null)

  React.useEffect(()=>{
    if(editCurrentTitle) {
      titleRef.current?.focus()
    }
  }, [editCurrentTitle])

  return (
    <div className="chat-bot-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="new-session-btn" onClick={()=>{
            if(!chatStore.isSettingReady()) {
              Dialog.toast({message: 'please select models before using..'})
              openById('chatBot-settingPanel')
              return
            }
            chatStore.createSession()
          }}>
            + 新規チャット
          </button>
        </div>
        <SessionList />
      </aside>

      <main className="chat-main">
        {currentSession ? (
          <>
            <header className="chat-header" onClick={()=>{
              setEditCurrentTitle(true)
            }}>
              <div className="session-info">
                {
                  editCurrentTitle?
                    <input ref={titleRef} className='session-title-edit' value={currentSession.title} onBlur={()=>{
                      setEditCurrentTitle(false)
                    }} onBlur={e=>{
                      setEditCurrentTitle(false)
                    }} onChange={e=>{
                      chatStore.updateSessionTitle(currentSessionId, e.target.value)
                    }} />:
                    <span className="session-title">
                      {currentSession.title}
                    </span>
                }
              </div>
            </header>
            <div className="chat-content">
              <MessageList sessionId={currentSession.id} />
            </div>
            <div className="chat-input-area">
              <ChatInput sessionId={currentSession.id} />
            </div>
          </>
        ) : (
          <div className="empty-state">セッションを選択してください</div>
        )}
      </main>
    </div>
  );
};

export default ChatBot;
