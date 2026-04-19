/**
 * @file TaskCard Component
 * @description 個別のタスクカード。編集、完了、ドラッグ＆ドロップに対応。
 * @author kagami-arch-import
 * @create 2026-04-17
 */

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTimer } from '@/hooks/useTimer';
import { updateTask, completeTask } from '@/store/todoStore';
import Dialog from '@/components/Dialog';
import './index.scss';

const TaskCard = ({ task, onComplete, onTriggerConfetti }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const { isPending, startTimer, cancelTimer } = useTimer(
    () => {
      onComplete(task.id);
      onTriggerConfetti();
      Dialog.toast('タスクを完了しました！');
    },
    2000
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: task.color
  };

  const handleToggleComplete = () => {
    if (isPending) {
      cancelTimer();
      Dialog.toast('キャンセルしました');
    } else {
      startTimer();
    }
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) {
      Dialog.toast('内容を入力してください');
      return;
    }
    updateTask(task.id, { text: editText });
    setIsEditing(false);
  };

  return (
    <div
      style={style}
      className={`task-card ${isPending ? 'pending' : ''}`}
    >
      <div className='move' ref={setNodeRef} {...attributes} {...listeners}>⠿</div>
      <div className="task-content" onClick={e=>{
        setIsEditing(true);
      }}>
        {isEditing ? (
          <input
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            autoFocus
          />
        ) : (
          <span className="task-text">{task.text}</span>
        )}
      </div>

      <div className="task-actions">
        <button
          className={`complete-btn ${isPending ? 'loading' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleToggleComplete(); }}
        >
          {isPending ? '...' : '✅'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
