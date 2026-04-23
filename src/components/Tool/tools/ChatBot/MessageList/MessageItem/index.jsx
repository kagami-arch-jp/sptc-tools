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

import speechStore from '@/store/speechStore'

const MessageItem = ({ message, sessionId }) => {
  const isUser = message.role === 'user';

  const {isSpeaking, id}=speechStore.useValue()

  return (
    <div className={cls(
      `message-item`,
      isUser ? 'user' : 'assistant',
      isSpeaking && id===message.id && 'speaking',
      !message.isLoading && 'ready',
    )}>
      <div className="message-bubble">
        {message.isLoading ? (
          <Spinner />
        ) : <div className='btn-area'>
          <Button size="small" status="normal" onClick={()=>{
            if(isSpeaking) {
              speechStore.stop()
            }else{
              speechStore.speak('ja-JP', message.content, message.id)
            }
          }}
          {...{
            children: isSpeaking? '停止': '再生',
            color: isSpeaking? "warning": "primary",
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
