/**
 * @file ChatInput Component
 * @description テキスト入力と送信ボタン、音声入力
 * @create 2026-04-18
 */

import React, { useState, useRef, useEffect } from 'react';
import chatStore from '@/store/chatStore';

import { useLanguage } from '@/store/globalSettingStore'
import './index.scss';

const ChatInput = ({ sessionId }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const isLoading = chatStore.useSessionById(sessionId)?.isLoading;
  const recognitionLanguage = useLanguage()

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = recognitionLanguage;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = event.results[event.results.length - 1][0].transcript
      if (transcript) {
        setText(prev => prev + transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [recognitionLanguage]);

  useEffect(() => {
    if (recognitionRef.current && recognitionRef.current.lang !== recognitionLanguage) {
      recognitionRef.current.lang = recognitionLanguage;
    }
  }, [recognitionLanguage]);

  const handleStartRecording = () => {
    if (!recognitionRef.current || isLoading) return;
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Failed to start recognition:', e);
    }
  };

  const handleStopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsRecording(false);
  };

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    const content = text.trim();
    setText('');
    handleStopRecording()
    chatStore.sendMessage(content)
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <button
        className={`voice-btn ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={isLoading}
        title={isRecording ? '音声入力を終了' : '音声入力'}
      >
        {isRecording ? '■' : '🎤'}
      </button>
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
