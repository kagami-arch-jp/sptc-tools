/**
 * @file ChatInput Component
 * @description テキスト入力と送信ボタン
 * @create 2026-04-18
 */

import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import './index.scss';

const ChatInput = ({ sessionId }) => {
  const [text, setText] = useState('');
  const { send, isLoading } = useChat();

  const handleSend = async () => {
    if (!text.trim() || isLoading) return;
    const content = text;
    setText('');
    await send(content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        className="chat-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力..."
        disabled={isLoading}
        onMouseMove={e=>e.target?.focus()}
      />
      <button
        className={`send-btn ${isLoading ? 'loading' : ''}`}
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? '...' : '送信'}
      </button>
    </div>
  );
};

export default ChatInput;
