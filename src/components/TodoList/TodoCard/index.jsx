/**
 * @file TodoCard component
 * @description 個別のタスクカード。編集、削除、ステータス切替、ドラッグハンドルを提供
 * @functionality 削除確認タイマー、ドラッグ＆ドロップ、編集モード
 * @created 2026-04-15
 * @usage <TodoCard todo={todo} />
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toggleTodo, deleteTodo, updateTodo } from '@/store/todoStore';
import { getContrastYIQ } from '@/utils/colorUtils';
import './index.scss';

function TodoCard({ todo }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const timerRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: todo.color,
    color: getContrastYIQ(todo.color),
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    timerRef.current = setTimeout(() => {
      deleteTodo(todo.id);
    }, 2000);
  };

  const cancelDelete = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsDeleting(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSaveEdit = () => {
    updateTodo(todo.id, editValue);
    setIsEditing(false);
  };

  const cardStyle = {
    ...style,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`todo-card ${isDeleting ? 'deleting' : ''} ${todo.completed ? 'completed' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        ⠿
      </div>

      {isEditing ? (
        <div className="edit-container">
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
          />
        </div>
      ) : (
        <div className="content-area" onClick={() => !isDeleting && toggleTodo(todo.id)}>
          {todo.text}
        </div>
      )}

      <div className="actions">
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          ✎
        </button>
        <button
          className={`delete-btn ${isDeleting ? 'confirm' : ''}`}
          onClick={isDeleting ? cancelDelete : handleDeleteClick}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TodoCard;
