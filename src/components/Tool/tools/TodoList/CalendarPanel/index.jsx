import React, { useState, useMemo, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useDarkMode } from '@/store/globalSettingStore';
import { todoStore, completeTask, batchRemoveTasks } from '@/store/todoStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti';
import Dialog from '@/components/Dialog';
import { useTimer } from '@/hooks/useTimer';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import './index.scss';

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

const BADGE_COLORS = [
  '#81C784', // 1 task
  '#64B5F6', // 2 tasks
  '#FFB74D', // 3 tasks
  '#E57373', // 4 tasks
  '#BA68C8', // 5 tasks
  '#90A4AE', // 6+ tasks
];

const CountdownBadge = ({ expectedDate }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!expectedDate) return null;

  const diff = new Date(expectedDate) - now;

  const getCountdownClass = (diffMs) => {
    if (diffMs <= 0) return 'expired';
    const s = Math.floor(diffMs / 1000);
    if (s <= 1800) return 'urgent';
    if (s <= 3600) return 'soon';
    if (s <= 86400) return 'today';
    return 'far';
  };

  const formatCountdown = (diffMs) => {
    if (diffMs <= 0) return '已过期';
    const totalSec = Math.floor(diffMs / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (d > 0) return `${d}日${h}時間`;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return (
    <span className={`countdown-badge countdown-${getCountdownClass(diff)}`}>
      {formatCountdown(diff)}
    </span>
  );
};

export const CalendarTaskItem = ({ task, onEdit }) => {
  const handleRef = useRef(null);
  const [itemNode, setItemNode] = useState(null);
  const [handleOffsetX, setHandleOffsetX] = useState(0);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { task, handleOffsetX },
  });

  const setCombinedRef = useCallback((node) => {
    setItemNode(node);
    setNodeRef(node);
  }, [setNodeRef]);

  useLayoutEffect(() => {
    if (itemNode && handleRef.current) {
      const itemRect = itemNode.getBoundingClientRect();
      const handleRect = handleRef.current.getBoundingClientRect();
      setHandleOffsetX(handleRect.left - itemRect.left);
    }
  }, [itemNode]);

  const { isPending, startTimer, cancelTimer } = useTimer(
    () => {
      completeTask(task.id);
      for (let i = 0; i < 6; i++) {
        confetti({ particleCount: 35, spread: 65, zIndex: 1000, origin: { y: 0.6, x: -0.1 }, angle: 25 + i * 15 });
        confetti({ particleCount: 35, spread: 65, zIndex: 1000, origin: { y: 0.6, x: 1.1 }, angle: 155 - i * 15 });
      }
      Dialog.toast('タスクを完了しました！');
    },
    2000
  );

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    if (isPending) {
      cancelTimer();
      Dialog.toast('キャンセルしました');
    } else {
      startTimer();
    }
  };

  const handleDeleteBatch = (e) => {
    e.stopPropagation();
    Dialog.confirm({
      message: 'このバッチタスクを全て削除しますか？',
      onConfirm: () => {
        const allTasks = todoStore.getValue().tasks;
        const batchTaskIds = allTasks
          .filter(t => t.batchId === task.batchId)
          .map(t => t.id);
        batchRemoveTasks(batchTaskIds);
        Dialog.toast('バッチタスクを削除しました');
      },
    });
  };

  return (
    <div
      ref={setCombinedRef}
      className={`calendar-task-item ${isPending ? 'pending' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ backgroundColor: task.color }}
    >
      {task.batchId && (
        <span className="batch-task-label">批</span>
      )}
      {!task.batchId && <CountdownBadge expectedDate={task.expectedDate} />}
      <div className="calendar-task-actions">
        {!task.batchId && (
          <button
            ref={handleRef}
            className="drag-handle-btn"
            style={{ touchAction: 'none', cursor: 'grab' }}
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
        )}
        <button
          className="edit-btn"
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
        >
          ✏️
        </button>
        <button
          className={`complete-btn ${isPending ? 'loading' : ''}`}
          onClick={handleToggleComplete}
        >
          {isPending ? '...' : '✅'}
        </button>
        {task.batchId && (
          <button
            className="delete-batch-btn"
            onClick={handleDeleteBatch}
          >
            🗑️
          </button>
        )}
      </div>
      <div className="calendar-task-text">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {task.text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export function getDateKey(d=new Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const CalendarDayCell = ({ cell, idx, firstDay, year, month, todayKey, isWide, tasksByDate, selectedDateKey, onSelectDate, prevMonth, nextMonth }) => {
  let keyYear = year;
  let keyMonth = month;
  if (cell.isOtherMonth) {
    if (idx < firstDay) {
      keyMonth -= 1;
    } else {
      keyMonth += 1;
    }
    if (keyMonth < 0) { keyMonth = 11; keyYear -= 1; }
    if (keyMonth > 11) { keyMonth = 0; keyYear += 1; }
  }
  const key = `${keyYear}-${String(keyMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
  const taskCount = tasksByDate[key]?.length || 0;
  const isToday = key === todayKey;
  const isSelected = key === selectedDateKey;

  const { isOver, setNodeRef } = useDroppable({ id: key, data: { dateKey: key } });

  return (
    <div
      ref={setNodeRef}
      className={[
        'calendar-day',
        cell.isOtherMonth ? 'other-month' : '',
        isToday ? 'today' : '',
        isSelected ? 'selected' : '',
        taskCount > 0 ? 'has-tasks' : '',
        isOver ? 'drag-over' : '',
      ].filter(Boolean).join(' ')}
      onClick={() => {
        if (cell.isOtherMonth) {
          if (idx < firstDay) prevMonth();
          else nextMonth();
        }
        onSelectDate(key);
      }}
    >
      <span className="day-number">{cell.day}</span>
      {taskCount > 0 && (
        isWide ? (
          <span
            className="task-badge"
            style={{ backgroundColor: BADGE_COLORS[Math.min(taskCount - 1, 5)] }}
          >
            {taskCount}
          </span>
        ) : (
          <span className="task-dot" />
        )
      )}
    </div>
  );
};

const CalendarPanel = ({ onEdit, isWide = true, selectedDate, onSelectDate }) => {
  const { tasks } = todoStore.useValue();
  const isDarkMode = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (!task.expectedDate) return;
      const d = new Date(task.expectedDate);
      const key = getDateKey(d)
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const todayKey = getDateKey(today);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isOtherMonth: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, isOtherMonth: false });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, isOtherMonth: true });
    }
  }

  return (
    <div className={`calendar-panel ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
        <span className="calendar-title">{year}年{month + 1}月</span>
        <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
      </div>
      <div className="calendar-weekdays">
        {DAYS_OF_WEEK.map(d => (
          <span key={d} className={d === '日' || d === '土' ? 'weekend' : ''}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((cell, idx) => (
          <CalendarDayCell
            key={idx}
            cell={cell}
            idx={idx}
            firstDay={firstDay}
            year={year}
            month={month}
            todayKey={todayKey}
            isWide={isWide}
            tasksByDate={tasksByDate}
            selectedDateKey={selectedDate}
            onSelectDate={onSelectDate}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarPanel;
