/**
 * @file ReaderList Component
 * @description 保存されたアイテムのリストを表示するコンポーネント
 * @created 2026-04-14
 */

import React from 'react';
import ReaderItem from '../ReaderItem';
import readerStore from '@/store/readerStore';
import { darkMode } from '@/store/darkMode'; // 修正: @/store/darkMode
import './index.scss';

function ReaderList() {
  const isDarkMode = darkMode.useValue();
  const { items } = readerStore.useValue();

  return (
    <div className={`reader-list ${isDarkMode ? 'dark' : ''}`}>
      <h2 className="list-title">保存済みリスト</h2>
      <div className="list-container">
        {items.length === 0 ? (
          <p className="empty-message">アイテムがありません</p>
        ) : (
          items.map((item) => (
            <ReaderItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default ReaderList;
