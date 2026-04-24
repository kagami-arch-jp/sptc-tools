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

  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    if (!session.isLoading) return;
    scrollToBottom()
  }, [session]);

  useEffect(() => {
    if (scrollRef.current?.scrollTop>0) return;
    scrollToBottom()
  }, [session.id]);

  if (!session) return null;

  return <div className="message-list" ref={scrollRef}>
    {session.messages.map((msg, idx) => (
      <MessageItem key={idx} message={msg} sessionId={sessionId} />
    ))}
  </div>
};

export default MessageList;
