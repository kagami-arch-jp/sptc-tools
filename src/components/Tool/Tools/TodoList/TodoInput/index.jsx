/**
 * @file TodoInput component
 * @description タスクの新規作成、カラー選択を行う入力エリア
 * @functionality タスク追加、カラープリセット選択、バリデーション
 * @created 2026-04-15
 * @usage <TodoInput />
 */

import React, { useState } from 'react';
import { addTodo } from '@/store/todoStore';
import { PRESET_COLORS } from '@/utils/colorUtils';
import './index.scss';

function TodoInput() {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] =
    useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!text.trim()) {
      setError('タスクを入力してください');
      return;
    }
    addTodo(text, selectedColor);
    setText('');
    setError('');
  };

  return (
    <div className="todo-input-container">
      <div className="input-group">
        <input
          className="text-area"
          placeholder="新しいタスクを入力..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="color-picker">
        {PRESET_COLORS.map((color) => (
          <div
            key={color}
            className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>

      <button className="add-button" onClick={handleAdd}>
        タスクを追加
      </button>
    </div>
  );
}

export default TodoInput;
