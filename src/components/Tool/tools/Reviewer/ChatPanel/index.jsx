/**
 * @file ChatPanel Component
 * @description 質問入力および履歴表示
 * @create 2026/04/15
 */

import React, { useState, useRef, useEffect } from 'react';
import './index.scss';
import ChatCard from '../ChatCard';
import reviewerStore from '@/store/reviewerStore';
import { getAiResponse } from '@/api/reviewerApi';
import Dialog from '@/components/Dialog'

function ChatPanel() {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  const state = reviewerStore.useValue();
  const {currentSessionId} = state;

  const currentSession = state.sessions.find(s => s.id === currentSessionId) || state.sessions[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession.chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) {
      alert('質問を入力してください。');
      return;
    }

    const questionText = input;
    setInput('');
    setIsSending(true);

    // 1. 質問を履歴に追加 (Loading状態)
    const newChatId = Date.now().toString();
    reviewerStore.setValue(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === currentSessionId ? {
        ...s,
        chatHistory: [...s.chatHistory, { id: newChatId, question: questionText, answer: '', isLoading: true, isError: false }]
      } : s)
    }));

    try {
      await getAiResponse({
        question: questionText,
        documentContent: currentSession.documentContent,
      }, (txt, response)=>{
        reviewerStore.setValue(prev => ({
          ...prev,
          sessions: prev.sessions.map(s => s.id === currentSessionId ? {
            ...s,
            chatHistory: s.chatHistory.map(h => h.id === newChatId ? { ...h, answer: response, isLoading: true } : h)
          } : s)
        }))
      })
      reviewerStore.setValue(prev => ({
        ...prev,
        sessions: prev.sessions.map(s => s.id === currentSessionId ? {
          ...s,
          chatHistory: s.chatHistory.map(h => h.id === newChatId ? { ...h, isLoading: false } : h)
        } : s)
      }))
    } catch (error) {
      // 3. エラー処理
      reviewerStore.setValue(prev => ({
        ...prev,
        sessions: prev.sessions.map(s => s.id === currentSessionId ? {
          ...s,
          chatHistory: s.chatHistory.map(h => h.id === newChatId ? { ...h, answer: 'エラーが発生しました。もう一度お試しください。', isLoading: false, isError: true } : h)
        } : s)
      }));
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteChat = (chatId) => {
    Dialog.confirm({
      message: 'Delete this message?',
      onConfirm: () => {
        reviewerStore.setValue(prev => ({
          ...prev,
          sessions: prev.sessions.map(s => s.id === currentSessionId ? {
            ...s,
            chatHistory: s.chatHistory.filter(h => h.id !== chatId)
          } : s)
        }))
      },
    })
  };

  return (
    <div className="chat-panel">
      <div className="chat-history" ref={scrollRef}>
        {currentSession.chatHistory.map(chat => (
          <ChatCard
            key={chat.id}
            chat={chat}
            onDelete={() => handleDeleteChat(chat.id)}
          />
        ))}
      </div>
      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            className="chat-textarea"
            value={input}
            onMouseOver={e=>e.target.focus()}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="質問を入力..."
          />
          <button
            className={`send-btn ${isSending ? 'loading' : ''}`}
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? '...' : '送信'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
