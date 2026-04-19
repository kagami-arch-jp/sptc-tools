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
  const sessions = chatStore.sessions.useValue();
  const currentId = chatStore.currentSessionId.useValue();

  return (
    <div className="chat-session-list">
      {sessions.map(session => (
        <div
          key={session.id}
          className={`chat-session-item ${currentId === session.id ? 'active' : ''}`}
          onClick={() => chatStore.setCurrentSession(session.id)}
        >
          <span className="session-name">{session.title}</span>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              Dialog.confirm({
                message: '削除しますか',
                onConfirm: ()=>chatStore.deleteSession(session.id),
              })
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
