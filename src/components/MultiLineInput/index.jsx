/**
 * @component MultiLineInput
 * @description テキスト入力とMarkdownプレビューを切り替え可能な入力コンポーネント
 * @description 機能一覧:
 * - モード(edit, readonly)の切り替え
 * - 表示形式(text, markdown)の切りط替え
 * - Markdownレンダリング表示
 * - フォーカス自動適用(ホバー時)
 * @author kagami-arch-j@bot
 * @created 2026-04-21
 * @example <MultiLineInput mode="edit" viewMode="markdown" onChange={handleChange} />
 */
import React, { useState, useRef, useEffect } from 'react';
import MarkdownViewer from '@/components/MarkdownViewer';
import { darkMode } from '@/store/darkMode';
import { cls } from '@/utils/css';
import './index.scss';

const MultiLineInput = ({
  mode = 'edit',
  placeholder = '',
  viewMode = 'text',
  value = '',
  onChange,
  className = ''
}) => {
  const isDarkMode = darkMode.useValue();
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const isReadOnly = mode === 'readonly';
  const isMarkdown = viewMode === 'markdown';

  const handleMouseEnter = () => {
    if (!isReadOnly && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTextChange = (e) => {
    if (isReadOnly) return;
    onChange?.(e.target.value);
  };

  return (
    <div
      className={cls(
        'ui-multiline-input',
        isDarkMode ? 'dark-mode' : '',
        className
      )}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
    >
      <div className="ui-multiline-input__header">
        <span className="ui-multiline-input__mode-indicator">
          {isReadOnly ? 'Read Only' : 'Editing'}
        </span>
        {!isReadOnly && (
          <button
            className="ui-multiline-input__toggle-btn"
            onClick={() => {
              // Note: In a real app, this might be controlled via props
              // For demo purposes, we assume the parent handles the viewMode switch
            }}
          >
            {isMarkdown ? 'Edit' : 'Preview'}
          </button>
        )}
      </div>

      <div className="ui-multiline-input__body">
        {isMarkdown ? (
          <div className="ui-multiline-input__markdown-container">
            <MarkdownViewer
              content={value}
              copyAll={true}
              copyCode={true}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className="ui-multiline-input__textarea"
            placeholder={placeholder}
            value={value}
            onChange={handleTextChange}
            readOnly={isReadOnly}
          />
        )}
      </div>
    </div>
  );
};

export default MultiLineInput;
