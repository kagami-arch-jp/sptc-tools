import React, { useState, useMemo } from 'react';
import { useDarkMode } from '@/store/globalSettingStore';
import { todoStore, completeTask } from '@/store/todoStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti';
import Dialog from '@/components/Dialog';
import { useTimer } from '@/hooks/useTimer';
import './index.scss';

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

const CalendarTaskItem = ({ task, onEdit }) => {
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

  return (
    <div className={`calendar-task-item ${isPending ? 'pending' : ''}`} style={{ borderLeftColor: task.color }}>
      <div className="calendar-task-text">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {task.text}
        </ReactMarkdown>
      </div>
      <div className="calendar-task-actions">
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
      </div>
    </div>
  );
};

const CalendarPanel = ({ onEdit }) => {
  const { tasks } = todoStore.useValue();
  const isDarkMode = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (!task.expectedDate) return;
      const d = new Date(task.expectedDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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

  const selectedTasks = selectedDate ? tasksByDate[selectedDate] || [] : [];

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
        {cells.map((cell, idx) => {
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
          const hasTasks = tasksByDate[key]?.length > 0;
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;
          return (
            <div
              key={idx}
              className={[
                'calendar-day',
                cell.isOtherMonth ? 'other-month' : '',
                isToday ? 'today' : '',
                isSelected ? 'selected' : '',
                hasTasks ? 'has-tasks' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelectedDate(isSelected ? null : key)}
            >
              <span className="day-number">{cell.day}</span>
              {hasTasks && <div className="task-dot" />}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="selected-date-tasks">
          <div className="selected-date-header">
            {selectedDate.replace(/-/g, '/')} のタスク
          </div>
          {selectedTasks.length === 0 ? (
            <div className="no-tasks">タスクはありません</div>
          ) : (
            selectedTasks.map(task => (
              <CalendarTaskItem key={task.id} task={task} onEdit={onEdit} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPanel;
