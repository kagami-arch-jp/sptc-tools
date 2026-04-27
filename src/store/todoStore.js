/**
 * @file todoStore.js
 * @description Todoリスト、完了済みタスク、およびフィルタ状態を管理する共有ストア。
 * @author kagami-arch-jp@bot
 * @create 2026-04-17
 */

import { createStoreSharedState } from '@/store/storage';
import createSharedState from 'react-cross-component-state';
// タスクの型定義（モック）
// id: string, text: string, color: string, completedAt?: Date, createdAt: Date

export const settingKey='todoStore-setting'
export const config=[]

export const todoStore = createStoreSharedState('todoStore', {
  tasks: [],        // 現在のタスク一覧
  isConfettiActive: false // 花火エフェクトの制御
});

export const filter=createSharedState({
  startDate: null,
  endDate: null
})

/**
 * タスクを追加する
 * @param {Object} task
 */
export const addTask = (task) => {
  todoStore.setValue(prev => ({
    ...prev,
    tasks: [{ ...task, id: crypto.randomUUID(), createdAt: new Date() }, ...prev.tasks]
  }));
};

/**
 * タスクを編集する
 * @param {string} id
 * @param {Object} updates
 */
export const updateTask = (id, updates) => {
  todoStore.setValue(prev => ({
    ...prev,
    tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  }));
};

/**
 * タスクを完了（アーカイブ）する
 * @param {string} id
 */
export const completeTask = (id) => {
  todoStore.setValue(prev => {
    const taskToComplete = prev.tasks.find(t => t.id === id);
    if (!taskToComplete) return prev;

    return {
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    };
  });
};

/**
 * タスクの順序を入れ替える
 * @param {Array} newOrder
 */
export const reorderTasks = (newOrder) => {
  todoStore.setValue(prev => ({
    ...prev,
    tasks: newOrder
  }));
};
