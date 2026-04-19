/**
 * @file MessageList Component
 * @description メッセージの表示エリア
 * @create 2026-04-18
 */

import React, { useEffect, useRef } from 'react';
import chatStore from '@/store/chatStore';
import MessageItem from '../MessageItem';
import './index.scss';

const MessageList = ({ sessionId }) => {
  const scrollRef = useRef(null);
  const sessions = chatStore.sessions.useValue();
  const session = sessions.find(s => s.id === sessionId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.parentNode.scrollTop = scrollRef.current.parentNode.scrollHeight;
    }
  }, [session?.messages]);

  if (!session) return null;

  return (
    <div className="message-list" ref={scrollRef}>
      {session.messages.map((msg, idx) => (
        <MessageItem key={idx} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
