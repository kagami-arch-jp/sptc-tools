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

const TaskForm = ({ isEditing, text, setText, color, setColor, expectedDate, setExpectedDate, isBatch, setIsBatch, batchStartDate, setBatchStartDate, batchEndDate, setBatchEndDate, onSave, onCancel, colors }) => {
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
        <div
          className={`batch-toggle ${isBatch ? 'active' : ''}`}
          onClick={() => setIsBatch(!isBatch)}
        >
          <div className="batch-toggle-knob" />
          <span className={`batch-toggle-option ${!isBatch ? 'selected' : ''}`}>期限</span>
          <span className={`batch-toggle-option ${isBatch ? 'selected' : ''}`}>一括追加</span>
        </div>
        {isBatch ? (
          <div className="batch-date-inputs">
            <input
              type="date"
              className="date-input"
              value={batchStartDate}
              onChange={(e) => setBatchStartDate(e.target.value)}
              placeholder="開始日"
            />
            <span className="batch-date-sep">~</span>
            <input
              type="date"
              className="date-input"
              value={batchEndDate}
              onChange={(e) => setBatchEndDate(e.target.value)}
              placeholder="終了日"
            />
          </div>
        ) : (
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
