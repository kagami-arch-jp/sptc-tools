/**
 * @file SessionList Component
 * @description 会話セッションの横並びリスト（ドラッグ＆ドロップ対応）
 * @create 2026/04/15
 */

import React from 'react';
import './index.scss';
import SessionItem from '../SessionItem';
import reviewerStore from '@/store/reviewerStore';


// Note: Using simple implementation for demo as dnd-kit requires complex setup
// In a real environment, we would use @dnd-kit/sortable here.

function SessionList() {
  const [state, setState] = reviewerStore.use();
  const { sessions, currentSessionId } = state;

  const handleRename = (id, newTitle) => {
    reviewerStore.setValue(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === id ? { ...s, title: newTitle } : s)
    }));
  };

  const deleteSession=id=>{
    reviewerStore.setValue(prev => {
      const sessions=prev.sessions.filter(s => s.id !== id)
      return {
        ...prev,
        sessions,
        currentSessionId: sessions[0]?.id,
      }
    })
  }

  return (
    <div className="session-list-container">
      <div className="session-items-wrapper">
        {sessions.map(session => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={session.id === currentSessionId}
            onSelect={(id) => reviewerStore.setValue(prev => ({ ...prev, currentSessionId: id }))}
            onRename={handleRename}
            onDelete={deleteSession}
          />
        ))}
      </div>
    </div>
  );
}

export default SessionList;
