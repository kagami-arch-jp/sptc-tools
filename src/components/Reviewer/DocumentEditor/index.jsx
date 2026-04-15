/**
 * @file DocumentEditor Component
 * @description ドキュメント入力エリア
 * @create 2026/04/15
 */

import React from 'react';
import './index.scss';
import reviewerStore from '@/store/reviewerStore';

function DocumentEditor() {
  const state=reviewerStore.useValue();
  const {currentSessionId}=state

  const currentSession = state.sessions.find(s => s.id === currentSessionId) || state.sessions[0];

  const handleChange = (e) => {
    const content = e.target.value;
    reviewerStore.setValue(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === currentSessionId ? { ...s, documentContent: content } : s)
    }));
  };

  return (
    <div className="document-editor">
      <div className="editor-header">ドキュメント</div>
      <textarea
        className="editor-textarea"
        placeholder="レビューしたいドキュメントを入力してください..."
        value={currentSession.documentContent}
        onChange={handleChange}
      />
    </div>
  );
}

export default DocumentEditor;
