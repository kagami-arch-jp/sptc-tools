/**
 * @file SessionList Component
 * @description サイドバーのセッション一覧表示
 * @create 2026-04-18
 */

import React from 'react';
import chatStore from '@/store/chatStore';
import './index.scss';
import Dialog from '@/components/Dialog'

const SessionList = () => {
  const {sessions, currentSessionId} = chatStore.useValue();

  return (
    <div className="chat-session-list">
      {sessions.map(session => (
        <div
          key={session.id}
          className={`chat-session-item ${currentSessionId === session.id ? 'active' : ''}`}
          onClick={() => chatStore.setCurrentSession(session.id)}
        >
          <span className="session-name">{session.title}</span>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              if(session.messages?.length>0) {
                Dialog.confirm({
                  message: '削除しますか',
                  onConfirm: ()=>chatStore.deleteSession(session.id),
                })
              }else{
                chatStore.deleteSession(session.id)
              }
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default SessionList;
