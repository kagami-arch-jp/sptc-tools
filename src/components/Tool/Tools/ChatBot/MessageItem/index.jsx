/**
 * @file MessageItem Component
 * @description 個別のメッセージバブル
 * @create 2026-04-18
 */

import React from 'react';
import MarkdownViewer from '@/components/MarkdownViewer';
import Spinner from '@/components/Spinner';
import './index.scss';

const MessageItem = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-item ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-bubble">
        {message.loading ? (
          <Spinner />
        ) : null}
        <MarkdownViewer className='message-area' content={message.content} />
      </div>
    </div>
  );
};

export default MessageItem;
