/**
 * @file todoStore.js
 * @description Todoリスト、完了済みタスク、およびフィルタ状態を管理する共有ストア。
 * @author kagami-arch-jp@bot
 * @create 2026-04-17
 */

import { createStoreSharedState } from '@/store/storage';
import createSharedState from 'react-cross-component-state';

import {newId} from '@/utils/base'

// タスクの型定義（モック）
// id: string, text: string, color: string, completedAt?: Date, createdAt: Date

export const settingKey='todoStore-setting'
export const config=[]

const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export const todoStore = createStoreSharedState('todoStore', {
  tasks: [],        // 現在のタスク一覧
  isConfettiActive: false, // 花火エフェクトの制御
  selectedDate: todayKey,  // カレンダーで選択中の日付
}, ()=>{
  todoStore.setValue(prev=>({...prev, selectedDate: todayKey}))
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
    tasks: [{ ...task, id: newId(), createdAt: new Date(), expectedDate: task.expectedDate || null }, ...prev.tasks]
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
 * 複数タスクを一括追加する
 * @param {Array} tasks
 */
export const batchAddTasks = (tasks) => {
  todoStore.setValue(prev => ({
    ...prev,
    tasks: [
      ...tasks.map(task => ({
        ...task,
        id: newId(),
        createdAt: new Date(),
        expectedDate: task.expectedDate || null,
      })),
      ...prev.tasks
    ]
  }));
};

/**
 * 複数タスクを一括更新する
 * @param {Array<{id: string, updates: Object}>} updates
 */
export const batchUpdateTasks = (updates) => {
  todoStore.setValue(prev => ({
    ...prev,
    tasks: prev.tasks.map(t => {
      const u = updates.find(item => item.id === t.id);
      return u ? { ...t, ...u.updates } : t;
    })
  }));
};

/**
 * 複数タスクを一括削除する
 * @param {string[]} ids
 */
export const batchRemoveTasks = (ids) => {
  todoStore.setValue(prev => ({
    ...prev,
    tasks: prev.tasks.filter(t => !ids.includes(t.id))
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

/**
 * カレンダーで選択中の日付を設定する
 * @param {string} dateKey YYYY-MM-DD 形式
 */
export const setSelectedDate = (dateKey) => {
  todoStore.setValue(prev => ({
    ...prev,
    selectedDate: dateKey,
  }));
};
