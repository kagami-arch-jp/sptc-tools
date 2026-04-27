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
import chatStore, {settingKey, roleBtnList} from '@/store/chatStore';
import './index.scss';
import { openById } from '@/store/modalButton';
import { useDarkMode } from '@/store/globalSettingStore';

const ChatBot = () => {
  const isDarkMode = useDarkMode();
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
      openById(settingKey+'-modal')
      return
    }
    chatStore.createSession()
  }

  const handleRoleSelect = (who) => {
    chatStore.startSessionByRole(currentSessionId, who)
  }

  const showRoleButtons = currentSession && !currentSession.who

  return (
    <div className={`chat-bot-container ${isDarkMode ? 'dark-mode' : ''}`}>
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
            {showRoleButtons ? (
              <div className="role-selection">
                {Object.entries(roleBtnList).map(([key, config]) => (
                  <button key={key} className="role-btn" onClick={() => handleRoleSelect(key)}>
                    <span className="role-btn-text">{config.text}</span>
                    {config.description && (
                      <span className="role-btn-desc">{config.description}</span>
                    )}
                  </button>
                ))}
              </div>
            ) : <>
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
              <ChatInput sessionId={currentSession.id} />
            </>}
          </>
        ) : (
          <div className="empty-state">セッションを選択してください</div>
        )}
      </main>
    </div>
  );
};

export default ChatBot;
