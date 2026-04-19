/**
 * @file Reviewer Component
 * @description AIドキュメントレビュー用メインコンポーネント
 * @feature
 * - 会話セッション管理
 * - ドキュメント編集
 * - AIチャット機能
 * @create 2026/04/15
 * @usage <Reviewer />
 */

import React from 'react';
import './index.scss';
import SessionList from './SessionList';
import DocumentEditor from './DocumentEditor';
import ChatPanel from './ChatPanel';
import reviewerStore from '@/store/reviewerStore';

function Reviewer() {
  const {sessions, currentSessionId} = reviewerStore.useValue();

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  // セッション作成
  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: new Date().toLocaleString('ja-JP'),
      documentContent: '',
      chatHistory: []
    };
    reviewerStore.setValue(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      currentSessionId: newId
    }));
  };

  // セッション切り替え
  const selectSession = (id) => {
    reviewerStore.setValue(prev => ({ ...prev, sessionId: id }));
  };

  React.useEffect(()=>{
    if(!sessions.length) createNewSession()
  }, [sessions])

  return (
    <div className={`reviewer-container`}>
      <div className="reviewer-sidebar">
        <div className="session-list-header">
          <button className="new-session-btn" onClick={createNewSession}>
            新規作成
          </button>
        </div>
        <SessionList />
      </div>
      <div className="reviewer-main">
        {sessions.length? <div className="reviewer-content-split">
          <DocumentEditor />
          <ChatPanel />
        </div>: null}
      </div>
    </div>
  );
}

export default Reviewer;
