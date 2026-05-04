/**
 * @file TodoList Component
 * @description タスクの作成、管理、および履歴表示を行うメインコンポーネント。
 * @version 1.0.0
 * @create 2026-04-17
 * @usage <TodoList />
 * @author kagami-arch
 *
 * 機能リスト:
 * - タスクの新規作成（テキスト入力、カラーパレット選択）
 * - タスクの編集
 * - ドラッグ＆ドロップによる並べ替え
 * - 2秒待機によるタスク完了ロジック
 * - 完了時のお祝いエフェクト（Confetti）
 * - 完了済みタスクの履歴表示（期間フィルタリング機能付き）
 */

import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';
import Dialog from '@/components/Dialog';
import Modal from '@/components/Modal';

import { todoStore, addTask, updateTask, completeTask, reorderTasks } from '@/store/todoStore';
import { ModalButton } from '@/components/Modal'
import {cls} from '@/utils/css'

import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

import './index.scss';

const PRESET_COLORS = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];

const TodoList = () => {
  const { tasks, isConfettiActive } = todoStore.useValue();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formText, setFormText] = useState('');
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [enableDate, setEnableDate] = useState(false);
  const [expectedDate, setExpectedDate] = useState('');

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 10,
      tolerance: 5,
    },
  });
  const sensors = useSensors(pointerSensor);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormText('');
    setFormColor(PRESET_COLORS[0]);
    setEnableDate(false);
    setExpectedDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormText(task.text);
    setFormColor(task.color);
    if (task.expectedDate) {
      setEnableDate(true);
      const d = new Date(task.expectedDate);
      const localDateTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      setExpectedDate(localDateTime);
    } else {
      setEnableDate(false);
      setExpectedDate('');
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
      expectedDate: enableDate && expectedDate ? new Date(expectedDate) : null
    };
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newOrder);
    }
  };

  return (
    <div className="todo-list-container">
      <div className='todo-main'>
        <button className="add-task-btn" onClick={handleOpenCreate}>
          タスクを追加
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          isEditing={!!editingTask}
          text={formText}
          setText={setFormText}
          color={formColor}
          setColor={setFormColor}
          expectedDate={expectedDate}
          setExpectedDate={setExpectedDate}
          enableDate={enableDate}
          setEnableDate={setEnableDate}
          onSave={handleSaveTask}
          onCancel={() => setIsModalOpen(false)}
          colors={PRESET_COLORS}
        />
      </Modal>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onEdit={handleOpenEdit}
                onTriggerConfetti={async () => {
                  for(let i=0; i<6; i++) {
                    confetti({ particleCount: 35, spread: 65, zIndex: 1000, origin: { y: 0.6, x:-.1 }, angle: 25+i*15 })
                    confetti({ particleCount: 35, spread: 65, zIndex: 1000, origin: { y: 0.6, x:1.1 }, angle: 155-i*15 })
                    await new Promise(r=>setTimeout(r, 100))
                  }
                }}
              />
            ))}
            {tasks.length === 0 && <div className="empty-state">タスクはありません</div>}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TodoList;
