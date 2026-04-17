/**
 * @file TodoList component
 * @description TodoListのメインコンポーネント。左右分割レイアウトとドラッグ＆ドロップの管理
 * @functionality レイアウト管理、DNDコンテキスト、リストの並べ替え
 * @created 2026-04-15
 * @usage <TodoList />
 */

import React from 'react';
import { DndContext, closestCenter} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { darkMode } from '@/store/darkMode';
import todoStore, { moveTodo } from '@/store/todoStore';
import TodoInput from './TodoInput';
import TodoCard from './TodoCard';
import './index.scss';
import {cls} from '@/utils/css'

import SizeObserver from '@/components/SizeObserver'

function TodoList() {
  const { todos } = todoStore.useValue();
  const isDarkMode = darkMode.useValue();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveTodo(active.id, over.id);
    }
  };

  return (
    <SizeObserver getClassName={({width})=>{
      if(width<560) return 'small'
      return 'normal'
    }} className={cls(`todo-list-wrapper`, isDarkMode && 'dark-mode')}>
      <div className="todo-container">
        {/* Left Side: Input Area */}
        <aside className="input-section">
          <TodoInput />
        </aside>

        {/* Right Side: List Area */}
        <main className="list-section">
          <div className="scroll-area">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={todos.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {todos.length > 0 ? (
                  todos.map((todo) => (
                    <TodoCard key={todo.id} todo={todo} />
                  ))
                ) : (
                  <div className="empty-state">
                    タスクがありません。
                  </div>
                )}
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
    </SizeObserver>
  );
}

export default TodoList;
