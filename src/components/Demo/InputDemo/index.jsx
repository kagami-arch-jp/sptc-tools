/**
 * @component InputDemo
 * @description MultiLineInputコンポーネントのカタログ表示用コンポーネント
 * @author kagami-arch-j@bot
 * @created 2026-04-21
 */
import React, { useState } from 'react';
import MultiLineInput from '@/components/MultiLineInput';
import './index.scss';

const InputDemo = () => {
  const [text, setText] = useState('# Hello Markdown\nThis is a demo.');
  const [viewMode, setViewMode] = useState('text');
  const [mode, setMode] = useState('edit');

  const toggleView = () => {
    setViewMode(prev => prev === 'text' ? 'markdown' : 'text');
  };

  return (
    <div className="demo-section">
      <h2 className="demo-section__title">MultiLineInput Catalog</h2>
      <div className="demo-section__card">
        <div className="demo-controls">
          <button className="demo-control-btn" onClick={() => setMode(m => m === 'edit' ? 'readonly' : 'edit')}>
            Toggle Mode: {mode.toUpperCase()}
          </button>
          <button className="demo-control-btn" onClick={toggleView} disabled={mode === 'readonly'}>
            Toggle View: {viewMode.toUpperCase()}
          </button>
        </div>

        <div className="demo-input-container">
          <MultiLineInput
            mode={mode}
            viewMode={viewMode}
            value={text}
            onChange={setText}
            placeholder="Enter text here..."
          />
        </div>
      </div>
    </div>
  );
};

export default InputDemo;