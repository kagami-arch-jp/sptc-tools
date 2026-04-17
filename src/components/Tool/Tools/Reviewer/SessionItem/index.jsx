/**
 * @file SessionItem Component
 * @description 個別のセッションタブ
 * @create 2026/04/15
 */

import React from 'react';
import './index.scss';
import Dialog from '@/components/Dialog'

function SessionItem({ session, isActive, onSelect, onRename, onDelete }) {
  return (
    <div
      className={`session-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(session.id)}
    >
      <input
        className="session-title-input"
        value={session.title}
        onChange={(e) => onRename(session.id, e.target.value)}
        onClick={(e) => isActive && e.stopPropagation()}
      />
      <div onClick={e=>{
        e.stopPropagation()
        Dialog.confirm({
          message: 'Delete this session?',
          onConfirm: () => {
            onDelete(session.id)
          }
        })
      }}>x</div>
    </div>
  );
}

export default SessionItem;
