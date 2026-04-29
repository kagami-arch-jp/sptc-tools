/**
 * @file MessageItem Component
 * @description 個別のメッセージバブル
 * @create 2026-04-18
 */

import React, { useState, useRef, useEffect } from 'react';
import MarkdownViewer from '@/components/MarkdownViewer';
import Spinner from '@/components/Spinner';
import Dialog from '@/components/Dialog'
import chatStore from '@/store/chatStore'
import {cls} from '@/utils/css'
import './index.scss';

const MessageItem = ({ message, sessionId }) => {
  const isUser = message.role === 'user';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(()=>{
    return ()=>{
      if(message.isSpeaking) {
        chatStore.tiggerMessageSpeak(sessionId, message)
      }
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const getMenuItems = () => {
    const items = [];

    if (message.isLoading) {
      items.push({
        key: 'cancel',
        label: 'キャンセル',
        color: 'warning',
        action: () => {
          chatStore.stopReceiveMessage(sessionId, message.id);
          setMenuOpen(false);
        },
      });
    }

    if (!message.isLoading && message.content) {
      items.push({
        key: 'speak',
        label: message.isSpeaking ? '停止' : '再生',
        color: message.isSpeaking ? 'warning' : 'primary',
        action: () => {
          chatStore.tiggerMessageSpeak(sessionId, message);
          setMenuOpen(false);
        },
      });
    }

    if (!isUser && !message.isLoading) {
      items.push({
        key: 'retry',
        label: '再試行',
        color: 'warning',
        action: () => {
          chatStore.retryMessage(sessionId, message.id);
          setMenuOpen(false);
        },
      });
    }

    items.push({
      key: 'delete',
      label: '削除',
      color: 'danger',
      action: () => {
        Dialog.confirm({
          message: '削除しますか',
          onConfirm: () => {
            chatStore.deleteMessage(sessionId, message.id);
            setMenuOpen(false);
          },
        });
      },
    });

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className={cls(
      `message-item`,
      isUser ? 'user' : 'assistant',
      message.isSpeaking && 'speaking',
      !message.isLoading && 'ready',
    )}>
      <div className="message-bubble">
        <div className='tool-bar'>
          {message.isLoading? (
            <div className='loading-indicator'>
              <Spinner />
            </div>
          ): <div />}

          <div
            ref={badgeRef}
            className={cls('action-badge', menuOpen && 'open')}
            onMouseEnter={() => setMenuOpen(true)}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="badge-icon">⋯</span>
          </div>
        </div>

        <div
          ref={menuRef}
          className={cls('action-menu', menuOpen && 'expanded')}
        >
          {menuItems.map(item => (
            <button
              key={item.key}
              className={cls('menu-item', `color-${item.color}`)}
              onClick={item.action}
            >
              {item.label}
            </button>
          ))}
        </div>

        {
          !message.isLoading && !message.content?
            <div className='message-area'>Unknown Error</div>:
            <MarkdownViewer className='message-area' content={message.content} />
        }
      </div>
    </div>
  );
};

export default MessageItem;
