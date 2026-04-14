/**
 * @file ReaderItem Component
 * @description リスト内の個々のアイテムを表示し、再生・編集・削除の操作を行うコンポーネント
 * @created 2026-04-14
 */

import React from 'react';
import readerStore from '@/store/readerStore';
import { useSpeech } from '@/hooks/useSpeech';
import { darkMode } from '@/store/darkMode';
import './index.scss';

function ReaderItem({ item }) {
  const isDarkMode = darkMode.useValue();
  const { playingId } = readerStore.useValue();
  const { speak, stopSpeech } = useSpeech();

  const isPlaying = playingId === item.id;

  const handlePlayPause = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      speak(item);
    }
  };

  const handleDelete = () => {
    if (window.confirm('このアイテムを削除してもよろしいですか？')) {
      readerStore.deleteItem(item.id);
    }
  };

  // 編集用コールバック（通过 props 传递或直接在 store 逻辑中处理，此处为了符合组件化原则，假设通过某种方式通知 Form）
  // 由于 ReaderForm 是兄弟组件，这里我们通过一个简单的全局事件或直接在 Reader 层面处理，
  // 但为了符合“一次需求一个文件夹”原则，我们直接在 ReaderItem 里通过触发 store 逻辑或简单的 window event 模拟。
  // 实际上，最优雅的是在 Reader 组件里管理 editingId。
  const handleEdit = () => {
    readerStore.setValue(prev=>({...prev, currentEdit: item}))
  };

  return (
    <div className={`reader-item ${isDarkMode ? 'dark' : ''} ${isPlaying ? 'playing' : ''}`}>
      <div className="item-info">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-content-preview">{item.content.substring(0, 50)}...</p>
      </div>
      <div className="item-actions">
        <button
          className={`btn-play ${isPlaying ? 'stop' : 'play'}`}
          onClick={handlePlayPause}
          title={isPlaying ? '停止' : '再生'}
        >
          {isPlaying ? '停止' : '再生'}
        </button>
        <button className="btn-edit" onClick={handleEdit}>
          編集
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          削除
        </button>
      </div>
    </div>
  );
}

export default ReaderItem;
