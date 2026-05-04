/**
 * @file TaskForm Component
 * @description タスクの新規作成用フォーム。
 * @author kagami-arch-import
 * @create 2026-04-17
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './index.scss';

const TaskForm = ({ isEditing, text, setText, color, setColor, expectedDate, setExpectedDate, enableDate, setEnableDate, onSave, onCancel, colors }) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="task-form">
      <h3>{isEditing ? 'タスクを編集' : '新しいタスク'}</h3>
      <div className="input-group">
        <div className="editor-header">
          <button
            className={`preview-toggle ${isPreview ? 'active' : ''}`}
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? '編集' : 'プレビュー'}
          </button>
        </div>
        {isPreview ? (
          <div className="markdown-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {text || '入力がありません'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="新しいタスクを入力...（Markdown対応）"
            className="task-input"
            autoFocus
          />
        )}
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

      <div className="date-section">
        <label className="date-checkbox">
          <input
            type="checkbox"
            checked={enableDate}
            onChange={(e) => setEnableDate(e.target.checked)}
          />
          <span>期限を設定</span>
        </label>
        {enableDate && (
          <input
            type="datetime-local"
            className="date-input"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
          />
        )}
      </div>

      <div className="form-actions">
        <button className="cancel-btn" onClick={onCancel}>
          キャンセル
        </button>
        <button className="add-btn" onClick={onSave}>
          {isEditing ? '保存' : '追加'}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
