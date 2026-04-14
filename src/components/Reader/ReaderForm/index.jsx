/**
 * @file ReaderForm Component
 * @description テキストの新規作成および編集を行うフォームコンポーネント
 * @created 2026-04-14
 */

import React, { useState, useEffect } from 'react';
import readerStore from '@/store/readerStore';
import { darkMode } from '@/store/darkMode';
import './index.scss';

function ReaderForm() {
  const isDarkMode = darkMode.useValue();
  const {currentEdit}=readerStore.useValue()
  const {title='', content='', id: editingId=null}=currentEdit || {}

  function updateCurrentEdit(nextValue) {
    readerStore.setValue(prev=>({...prev, currentEdit: {...(prev.currentEdit || {}), ...nextValue}}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      readerStore.updateItem(editingId, { title, content });
      updateCurrentEdit({id: null});
    } else {
      const newItem = {
        id: Date.now().toString(),
        title,
        content,
      };
      readerStore.addItem(newItem);
    }
    updateCurrentEdit({title: '', content: ''})
  };

  const handleEditRequest = (item) => {
    updateCurrentEdit(item)
  };

  // 編集キャンセル用（親から渡されるか、内部で管理）
  // 今回は簡易化のため、入力欄をクリアするロジックを内包
  const cancelEdit = () => {
    updateCurrentEdit({
      id: null, title: '', content: ''
    })
  };

  return (
    <div className={`reader-form ${isDarkMode ? 'dark' : ''}`}>
      <h2 className="form-title">
        {editingId ? 'テキストを編集' : '新しいテキストを作成'}
      </h2>
      <form onSubmit={handleSubmit} className="form-content">
        <div className="input-group">
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => updateCurrentEdit({title: e.target.value})}
            placeholder="タイトルを入力してください"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="content">本文</label>
          <textarea
            id="content"
            rows="10"
            value={content}
            onChange={(e) => updateCurrentEdit({content: e.target.value})}
            placeholder="内容を入力してください"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? '更新する' : '保存する'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>
              キャンセル
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReaderForm;
