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
  const {sessions, currentSessionId} = chatStore.useValue()
  const currentSession=chatStore.useSessionById(currentSessionId)

  const [editCurrentTitle, setEditCurrentTitle]=React.useState(false)
  const titleRef=React.useRef(null)
  React.useEffect(()=>{
    if(editCurrentTitle) {
      titleRef.current?.focus()
    }
  }, [editCurrentTitle])

  const handleNewSession = () => {
    if(!chatStore.isSettingReady()) {
      Dialog.toast({message: 'please select models before using..'})
      openById('chatBot-settingPanel')
      return
    }
    chatStore.createSession()
  }

  const handleRoleSelect = (who) => {
    chatStore.createSession(who)
    chatStore.sendMessage('hi', who)
  }

  const showRoleButtons = currentSession && currentSession.messages.length === 0

  return (
    <div className="chat-bot-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="new-session-btn" onClick={handleNewSession}>
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
            <MessageList sessionId={currentSession.id} />
            {showRoleButtons ? (
              <div className="role-selection">
                <button className="role-btn" onClick={() => handleRoleSelect('chat')}>口语教师</button>
                <button className="role-btn" onClick={() => handleRoleSelect('mennsetsu')}>面接官</button>
              </div>
            ) : (
              <ChatInput sessionId={currentSession.id} />
            )}
          </>
        ) : (
          <div className="empty-state">セッションを選択してください</div>
        )}
      </main>
    </div>
  );
};

export default ChatBot;
