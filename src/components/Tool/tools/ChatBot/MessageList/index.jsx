/**
 * @file MessageList Component
 * @description メッセージの表示エリア
 * @create 2026-04-18
 */

import React, { useEffect, useRef } from 'react';
import chatStore from '@/store/chatStore';
import MessageItem from './MessageItem';
import './index.scss';

const MessageList = ({ sessionId }) => {
  const scrollRef = useRef(null)
  const session = chatStore.useSessionById(sessionId)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.parentNode.scrollTop = scrollRef.current.parentNode.scrollHeight;
    }
  }, [session]);

  if (!session) return null;

  return (
    <div className="message-list" ref={scrollRef}>
      {session.messages.map((msg, idx) => (
        <MessageItem key={idx} message={msg} sessionId={sessionId} />
      ))}
    </div>
  );
};

export default MessageList;
