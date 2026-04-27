/**
 * @file MessageItem Component
 * @description 個別のメッセージバブル
 * @create 2026-04-18
 */

import React from 'react';
import MarkdownViewer from '@/components/MarkdownViewer';
import Spinner from '@/components/Spinner';
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import chatStore from '@/store/chatStore'
import {cls} from '@/utils/css'
import './index.scss';

import * as Speaker from '@/utils/speech'

const MessageItem = ({ message, sessionId }) => {
  const isUser = message.role === 'user';

  React.useEffect(()=>{
    return ()=>{
      if(message.isSpeaking) {
        chatStore.tiggerMessageSpeak(sessionId, message)
      }
    }
  }, [])

  return (
    <div className={cls(
      `message-item`,
      isUser ? 'user' : 'assistant',
      message.isSpeaking && 'speaking',
      !message.isLoading && 'ready',
    )}>
      <div className="message-bubble">
        {message.isLoading ? (
          <Spinner />
        ) : <div className='btn-area'>
          <Button size="small" status="normal" onClick={()=>{
            chatStore.tiggerMessageSpeak(sessionId, message)
          }}
          {...{
            children: message.isSpeaking? '停止': '再生',
            color: message.isSpeaking? "warning": "primary",
          }}
          />
          <Button size="small" color="danger" status="normal" onClick={()=>{
            Dialog.confirm({
              message: '削除しますか',
              onConfirm: ()=>chatStore.deleteMessage(sessionId, message.id),
            })
          }}>削除</Button>
        </div>}
        <MarkdownViewer className='message-area' content={message.content} />
      </div>
    </div>
  );
};

export default MessageItem;
