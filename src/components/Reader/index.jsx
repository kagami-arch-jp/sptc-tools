/**
 * @file Reader Component
 * @description テキストの保存、リスト表示、および音声読み上げを行うメインコンポーネント
 * @feature テキストCRUD、音声ループ再生、ダークモード対応
 * @created 2026-04-14
 * @usage <Reader />
 */

import React from 'react';
import ReaderForm from './ReaderForm';
import ReaderList from './ReaderList';
import { darkMode } from '@/store/darkMode';
import './index.scss';

function Reader() {
  const isDarkMode = darkMode.useValue();

  return (
    <div className={`reader-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="reader-layout">
        <div className="reader-form-section">
          <ReaderForm />
        </div>
        <div className="reader-list-section">
          <ReaderList />
        </div>
      </div>
    </div>
  );
}

export default Reader;