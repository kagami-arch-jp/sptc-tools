import React, { useState, useCallback, useMemo } from 'react';
import Dialog from '@/components/Dialog';
import Modal from '@/components/Modal';
import SizeObserver from '@/components/SizeObserver';
import { todoStore, addTask, updateTask } from '@/store/todoStore';
import TaskForm from './TaskForm';
import CalendarPanel, { CalendarTaskItem, getDateKey } from './CalendarPanel';
import './index.scss';

const PRESET_COLORS = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];

const TodoList = () => {
  const { tasks } = todoStore.useValue();
  const [containerWidth, setContainerWidth] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getDateKey());

  const handleResize = useCallback(({ width }) => {
    setContainerWidth(width);
  }, []);

  const isWide = containerWidth > 640;
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

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormText('');
    setFormColor(PRESET_COLORS[0]);
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    const localDateTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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
    </SizeObserver>
  );
};

export default TodoList;
