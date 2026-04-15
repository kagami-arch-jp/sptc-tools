/**
 * @file HistoryItem/index.jsx
 * @description 履歴の各アイテムを表示し、コピー・削除・モード切替を行うコンポーネント。
 * @feature コピー機能、削除機能、Markdown表示切替、UIフィードバック
 * @create 2026-04-15
 * @usage <HistoryItem item={item} />
 */

import React, { useState } from 'react';
import {getHistoryListStoreByKey} from '@/store/historyStore';
import MarkdownViewer from '@/components/MarkdownViewer'; // 既存コンポーネントを想定
import './index.scss';

function HistoryItem({ historyKey, item }) {
  const historyStore=getHistoryListStoreByKey(historyKey)
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(item.content);
      // 成功時のフィードバック（簡易的な実装）
      setTimeout(() => setIsCopying(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      setIsCopying(false);
      alert('コピーに失敗しました');
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // 削除処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 300));
      historyStore.deleteHistory(item.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleMode = () => {
    setIsMarkdownMode(!isMarkdownMode);
  };

  const date = new Date(item.timestamp).toLocaleString('ja-JP');

  return (
    <div className={`history-item ${isDeleting ? 'is-deleting' : ''}`}>
      <div className="history-item-header">
        <span className="history-item-date">{date}</span>
        <div className="history-item-actions">
          <button
            className="action-button copy-button"
            onClick={handleCopy}
            disabled={isCopying}
          >
            {isCopying ? '...' : 'コピー'}
          </button>
          <button
            className="action-button mode-button"
            onClick={toggleMode}
          >
            {isMarkdownMode ? 'テキスト' : 'MD'}
          </button>
          <button
            className="action-button delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '...' : '削除'}
          </button>
        </div>
      </div>

      <div className="history-item-content">
        {isMarkdownMode ? (
          <MarkdownViewer content={item.content} />
        ) : (
          <pre className="history-item-text">{item.content}</pre>
        )}
      </div>
    </div>
  );
}

export default HistoryItem;
