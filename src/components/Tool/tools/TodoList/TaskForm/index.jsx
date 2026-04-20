/**
 * @file TaskForm Component
 * @description タスクの新規作成用フォーム。
 * @author kagami-arch-import
 * @create 2026-04-17
 */

import React from 'react';
import { updateTask } from '@/store/todoStore';
import './index.scss';

const TaskForm = ({ text, setText, color, setColor, onAdd, colors }) => {
  return (
    <div className="task-form">
      <div className="input-group">
        <textarea
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="task-input"
        />
      </div>

      <div className="color-palette">
        {colors.map((c) => (
          <div
            key={c}
            className={`color-swatch ${color === c ? 'active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>

      <button className="add-btn" onClick={onAdd}>
        タスクを追加
      </button>
    </div>
  );
};

export default TaskForm;
