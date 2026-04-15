/**
 * @file ChatCard Component
 * @description 質問と回答のカード
 * @create 2026/04/15
 */

import React from 'react';
import './index.scss';

function ChatCard({ chat, onDelete }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('コピーしました');
 };

  return (
    <div className={`chat-card ${chat.isError ? 'error' : ''}`}>
      <div className="chat-card-content">
        <div className="question-section">
          <div className="question-text">{chat.question}</div>
          <div className="card-actions">
            <button className="action-btn copy" onClick={() => copyToClipboard(chat.question+'\n\n'+chat.answer+'\n')}>
              コピー
            </button>
            <button className="action-btn delete" onClick={onDelete}>
              削除
            </button>
          </div>
        </div>
        <div className="answer-section">
          {chat.isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>回答を生成中...</span>
            </div>
          ) : null}
          {
            chat.answer && <div className="answer-text">{chat.answer}</div>
          }
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
