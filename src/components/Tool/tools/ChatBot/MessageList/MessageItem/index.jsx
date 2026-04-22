/**
 * @file MessageItem Component
 * @description 個別のメッセージバブル
 * @create 2026-04-18
 */

import React from 'react';
import MarkdownViewer from '@/components/MarkdownViewer';
import Spinner from '@/components/Spinner';
import Dialog from '@/components/Dialog'
import chatStore from '@/store/chatStore'
import {cls} from '@/utils/css'
import './index.scss';

import speechStore from '@/store/speechStore'

const MessageItem = ({ message, sessionId }) => {
  const isUser = message.role === 'user';

  const {isSpeaking}=speechStore.useValue()

  return (
    <div className={cls(
      `message-item`,
      isUser ? 'user' : 'assistant',
      isSpeaking && 'speaking',
      !message.isLoading && 'ready',
    )} onClick={()=>{
      if(message.isLoading) return;
      if(isSpeaking) {
        speechStore.stop()
      }else{
        speechStore.speak('ja-JP', message.content)
      }
    }}>
      <div className="message-bubble">
        {message.isLoading ? (
          <Spinner />
        ) : null}
        <MarkdownViewer className='message-area' content={message.content} />
      </div>
    </div>
  );
};

export default MessageItem;
