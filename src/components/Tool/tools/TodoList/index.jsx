import React, { useState, useCallback, useMemo } from 'react';
import Dialog from '@/components/Dialog';
import Modal from '@/components/Modal';
import SizeObserver from '@/components/SizeObserver';
import { todoStore, addTask, updateTask, setSelectedDate, batchAddTasks, batchUpdateTasks, batchRemoveTasks } from '@/store/todoStore';
import { newId } from '@/utils/base';
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
  const [dragHandleOffsetX, setDragHandleOffsetX] = useState(0);
  const [editingTask, setEditingTask] = useState(null);
  const [formText, setFormText] = useState('');
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [expectedDate, setExpectedDate] = useState('');
  const [isBatch, setIsBatch] = useState(false);
  const [batchStartDate, setBatchStartDate] = useState('');
  const [batchEndDate, setBatchEndDate] = useState('');

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
    setIsBatch(false);
    setBatchStartDate('');
    setBatchEndDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormText(task.text);
    setFormColor(task.color);
    if (task.batchId) {
      setIsBatch(true);
      setBatchStartDate(task.batchStartDate || '');
      setBatchEndDate(task.batchEndDate || '');
      setExpectedDate('');
    } else {
      setIsBatch(false);
      setBatchStartDate('');
      setBatchEndDate('');
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
    }
    setIsModalOpen(true);
  };

  const toDateKey = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleSaveTask = () => {
    if (!formText.trim()) {
      Dialog.toast('タスクを入力してください');
      return;
    }

    if (isBatch) {
      if (!batchStartDate || !batchEndDate) {
        Dialog.toast('開始日と終了日を入力してください');
        return;
      }
      if (batchStartDate > batchEndDate) {
        Dialog.toast('開始日は終了日より前の日付にしてください');
        return;
      }

      if (editingTask && editingTask.batchId) {
        const batchId = editingTask.batchId;
        const oldStartDateStr = editingTask.batchStartDate;
        const oldEndDateStr = editingTask.batchEndDate;

        const batchTasks = tasks.filter(t => t.batchId === batchId);

        const newStart = new Date(batchStartDate + 'T00:00:00');
        const newEnd = new Date(batchEndDate + 'T00:00:00');

        const newDateSet = new Set();
        for (let d = new Date(newStart); d <= newEnd; d.setDate(d.getDate() + 1)) {
          newDateSet.add(toDateKey(d));
        }

        const tasksToRemove = [];
        const updates = [];
        batchTasks.forEach(t => {
          const key = toDateKey(new Date(t.expectedDate));
          if (newDateSet.has(key)) {
            updates.push({
              id: t.id,
              updates: {
                text: formText,
                color: formColor,
                batchStartDate,
                batchEndDate,
              }
            });
          } else {
            tasksToRemove.push(t.id);
          }
        });

        if (updates.length > 0) {
          batchUpdateTasks(updates);
        }
        if (tasksToRemove.length > 0) {
          batchRemoveTasks(tasksToRemove);
        }

        const existingKeys = new Set(batchTasks.map(t => toDateKey(new Date(t.expectedDate))));
        const tasksToAdd = [];
        for (let d = new Date(newStart); d <= newEnd; d.setDate(d.getDate() + 1)) {
          const key = toDateKey(d);
          if (!existingKeys.has(key)) {
            tasksToAdd.push({
              text: formText,
              color: formColor,
              expectedDate: new Date(d),
              batchId,
              batchStartDate,
              batchEndDate,
            });
          }
        }
        if (tasksToAdd.length > 0) {
          batchAddTasks(tasksToAdd);
        }
      } else {
        const batchId = newId();
        const start = new Date(batchStartDate + 'T00:00:00');
        const end = new Date(batchEndDate + 'T00:00:00');
        const tasksToAdd = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          tasksToAdd.push({
            text: formText,
            color: formColor,
            expectedDate: new Date(d),
            batchId,
            batchStartDate,
            batchEndDate,
          });
        }
        batchAddTasks(tasksToAdd);
      }
    } else {
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
    }
    setIsModalOpen(false);
  };

  const handleDragStart = useCallback((event) => {
    const task = event.active.data.current?.task ?? null;
    if (task?.batchId) return;
    setActiveTask(task);
    setDragHandleOffsetX(event.active.data.current?.handleOffsetX ?? 0);
  }, []);

  const handleDragEnd = useCallback((event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task;
    const targetDateKey = over.data.current?.dateKey;
    if (!task || !targetDateKey || task.batchId) return;

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
          isBatch={isBatch}
          setIsBatch={setIsBatch}
          batchStartDate={batchStartDate}
          setBatchStartDate={setBatchStartDate}
          batchEndDate={batchEndDate}
          setBatchEndDate={setBatchEndDate}
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
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div style={{ transform: `translateX(${dragHandleOffsetX}px)` }}>
              <div
                className="calendar-task-drag-icon"
                style={{ backgroundColor: activeTask.color }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2.5"/>
                  <circle cx="12" cy="4" r="1.5"/>
                  <circle cx="12" cy="20" r="1.5"/>
                  <circle cx="4" cy="12" r="1.5"/>
                  <circle cx="20" cy="12" r="1.5"/>
                </svg>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </SizeObserver>
  );
};

export default TodoList;
