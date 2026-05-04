/**
 * @file TaskCard Component
 * @description 個別のタスクカード。編集、完了、ドラッグ＆ドロップに対応。
 * @author kagami-arch-import
 * @create 2026-04-17
 */

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTimer } from '@/hooks/useTimer';
import { updateTask, completeTask } from '@/store/todoStore';
import Dialog from '@/components/Dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './index.scss';

const TaskCard = ({ task, onComplete, onTriggerConfetti, onEdit }) => {
  const [countdown, setCountdown] = useState('');

  const { isPending, startTimer, cancelTimer } = useTimer(
    () => {
      onComplete(task.id);
      onTriggerConfetti();
      Dialog.toast('タスクを完了しました！');
    },
    2000
  );

  useEffect(() => {
    if (!task.expectedDate) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(task.expectedDate);
      const diff = target - now;

      if (diff <= 0) {
        setCountdown('期限切れ');
        return true; // 过期标记，用于清除定时器
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}日${hours}時${minutes}分`);
      } else if (hours > 0) {
        setCountdown(`${hours}時${minutes}分${seconds}秒`);
      } else {
        setCountdown(`${minutes}分${seconds}秒`);
      }
      return false;
    };

    const isExpired = updateCountdown();
    if (isExpired) return; // 已过期，不设置定时器

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [task.expectedDate]);

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
    backgroundColor: task.color,
  };

  const handleToggleComplete = () => {
    if (isPending) {
      cancelTimer();
      Dialog.toast('キャンセルしました');
    } else {
      startTimer();
    }
  };

  const isExpired = countdown === '期限切れ';

  const isMoreThanOneHour = (() => {
    if (!task.expectedDate || isExpired) return false;
    const diff = new Date(task.expectedDate) - new Date();
    return diff > 1000 * 60 * 60;
  })();

   return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isPending ? 'pending' : ''}`}
    >
      {countdown && (
        <div className={`countdown-badge ${isExpired ? 'expired' : ''} ${isMoreThanOneHour ? 'green' : ''}`}>
          {countdown}
        </div>
      )}
      <div className='move' {...attributes} {...listeners}>⠿</div>
      <div className="task-content">
        <div className="task-text-wrapper">
          <div className="task-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {task.text}
            </ReactMarkdown>
          </div>
          {task.expectedDate && (
            <span className="task-date">
              {new Date(task.expectedDate).toLocaleString('ja-JP', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
      </div>

       <div className="task-actions">
         <button
           className="edit-btn"
           onClick={(e) => { e.stopPropagation(); onEdit(task); }}
           onPointerDown={(e) => e.stopPropagation()}
         >
           ✏️
         </button>
         <button
           className={`complete-btn ${isPending ? 'loading' : ''}`}
           onClick={(e) => { e.stopPropagation(); handleToggleComplete(); }}
           onPointerDown={(e) => e.stopPropagation()}
         >
           {isPending ? '...' : '✅'}
         </button>
       </div>
    </div>
  );
};

export default TaskCard;
