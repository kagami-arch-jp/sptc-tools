import React, { useState, useCallback, useMemo } from 'react';
import Dialog from '@/components/Dialog';
import Modal from '@/components/Modal';
import SizeObserver from '@/components/SizeObserver';
import { todoStore, addTask, updateTask, setSelectedDate } from '@/store/todoStore';
import TaskForm from './TaskForm';
import CalendarPanel, { CalendarTaskItem, getDateKey } from './CalendarPanel';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import './index.scss';

const PRESET_COLORS = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];

const TodoList = () => {
  const { tasks, selectedDate } = todoStore.useValue();
  const [containerWidth, setContainerWidth] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResize = useCallback(({ width }) => {
    setContainerWidth(width);
  }, []);

  const isWide = containerWidth > 600;
  const [activeTask, setActiveTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [formText, setFormText] = useState('');
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [expectedDate, setExpectedDate] = useState('');

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (!task.expectedDate) return;
      const d = new Date(task.expectedDate);
      const key = getDateKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  const selectedTasks = selectedDate ? tasksByDate[selectedDate] || [] : [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormText('');
    setFormColor(PRESET_COLORS[0]);
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    const datePart = selectedDate || getDateKey(d);
    const localDateTime = `${datePart}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    setExpectedDate(localDateTime);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormText(task.text);
    setFormColor(task.color);
    if (task.expectedDate) {
      const d = new Date(task.expectedDate);
      const localDateTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      setExpectedDate(localDateTime);
    } else {
      const d = new Date();
      d.setHours(d.getHours() + 1, 0, 0, 0);
      const localDateTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      setExpectedDate(localDateTime);
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!formText.trim()) {
      Dialog.toast('タスクを入力してください');
      return;
    }
    const taskData = {
      text: formText,
      color: formColor,
      expectedDate: new Date(expectedDate)
    };
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handleDragStart = useCallback((event) => {
    setActiveTask(event.active.data.current?.task ?? null);
  }, []);

  const handleDragEnd = useCallback((event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task;
    const targetDateKey = over.data.current?.dateKey;
    if (!task || !targetDateKey) return;

    const origDate = task.expectedDate ? new Date(task.expectedDate) : new Date();
    const currentDateKey = task.expectedDate ? getDateKey(origDate) : null;
    if (currentDateKey === targetDateKey) return;

    Dialog.confirm({
      message: `「${task.text}」の日付を${targetDateKey.replace(/-/g, '/')}に変更しますか？`,
      onConfirm: () => {
        const [y, m, d] = targetDateKey.split('-').map(Number);
        const newDate = new Date(y, m - 1, d, origDate.getHours(), origDate.getMinutes(), origDate.getSeconds());
        updateTask(task.id, { expectedDate: newDate });
      }
    });
  }, []);

  return (
    <SizeObserver className="todo-list-container" onChangeSize={handleResize}>
      <div className='todo-main'>
        <button className="add-task-btn" onClick={handleOpenCreate}>
          タスクを追加
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} width={isWide ? 50 : 85}>
        <TaskForm
          isEditing={!!editingTask}
          text={formText}
          setText={setFormText}
          color={formColor}
          setColor={setFormColor}
          expectedDate={expectedDate}
          setExpectedDate={setExpectedDate}
          onSave={handleSaveTask}
          onCancel={() => setIsModalOpen(false)}
          colors={PRESET_COLORS}
        />
      </Modal>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {isWide ? (
          <div className="todo-layout">
            <div className="todo-left">
              <CalendarPanel
                isWide
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onEdit={handleOpenEdit}
              />
            </div>
            <div className="todo-right">
              <div className="selected-date-tasks">
                <div className="selected-date-header">
                  {selectedDate.replace(/-/g, '/')} のタスク
                </div>
                {selectedTasks.length === 0 ? (
                  <div className="no-tasks">タスクはありません</div>
                ) : (
                  selectedTasks.map(task => (
                    <CalendarTaskItem key={task.id} task={task} onEdit={handleOpenEdit} />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="narrow-content">
            <CalendarPanel
              isWide={false}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onEdit={handleOpenEdit}
            />
            <div className="selected-date-tasks">
              <div className="selected-date-header">
                {selectedDate.replace(/-/g, '/')} のタスク
              </div>
              {selectedTasks.length === 0 ? (
                <div className="no-tasks">タスクはありません</div>
              ) : (
                selectedTasks.map(task => (
                  <CalendarTaskItem key={task.id} task={task} onEdit={handleOpenEdit} />
                ))
              )}
            </div>
          </div>
        )}
        <DragOverlay dropAnimation={null} style={{ width: 'auto', height: 'auto' }}>
          {activeTask ? (
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <div
                className="calendar-task-item"
                style={{
                  backgroundColor: activeTask.color,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  opacity: 0.75,
                  transform: 'rotate(3deg)',
                }}
              >
                <div className="calendar-task-text calendar-task-overlay-text">
                  {activeTask.text}
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </SizeObserver>
  );
};

export default TodoList;
