/**
 * @file HistoryList/index.jsx
 * @description 履歴リストを表示するメインコンポーネント。
 * @feature 履歴のリスト表示、空状態のハンドリング
 * @create 2026-04-15
 * @usage <HistoryList />
 */

import React from 'react';
import {getHistoryListStoreByKey} from '@/store/historyStore';
import HistoryItem from './HistoryItem';
import './index.scss';

function HistoryList({historyKey}) {
  const historyStore=getHistoryListStoreByKey(historyKey);
  const historyItems = historyStore.useValue();
  return (
    <div className="history-list-container">
      <h2 className="history-list-title">操作履歴</h2>
      {historyItems.length === 0 ? (
        <div className="history-list-empty">
          <p>履歴がありません</p>
        </div>
      ) : (
        <div className="history-list-items">
          {historyItems.map((item) => (
            <HistoryItem key={item.id} historyKey={historyKey} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryList;
