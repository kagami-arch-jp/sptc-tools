/**
 * @file Writer Component
 * @description ライターのメインレイアウトコンポーネント
 * @create 2026-04-18
 * @usage <Writer />
 */

import React, { useState, useRef } from 'react';
import './index.scss';
import { replaceRange, removeDuplicateString } from '@/utils/textSelection';
import writerSessions, { settingKey } from '@/store/writerStore';
import { useWriterKeyboardShortcuts } from '@/utils/keyboardUtils';
import MarkdownViewer from '@/components/MarkdownViewer';
import { openById } from '@/store/modalButton';
import { useDarkMode } from '@/store/globalSettingStore';
import Dialog from '@/components/Dialog';

export default function Writer() {
  const isDarkMode = useDarkMode();
  const [{ sessions, selectedId }] = writerSessions.use();
  const contentRef = useRef(null);
  const ruleRef = useRef(null);

  const [suggestion, setSuggestion] = useState({
    pending: false,
    timestamp: 0,
    res: '',
    pos: [0, 0],
  });

  const current = sessions.find(s => s.id === selectedId);
  const [showMarkdown, setShowMarkdown] = useState(false);

  const handleNewSession = () => {
    if (!writerSessions.isSettingReady()) {
      Dialog.toast({ message: 'please select models before using..' });
      openById(settingKey + '-modal');
      return;
    }
    writerSessions.createSession();
  };

  const handleQuery = (txt, queryType, pos) => {
    writerSessions.querySuggestion(
      txt,
      queryType,
      pos,
      ruleRef.current?.value.trim() || '',
      (update) => {
        if (typeof update === 'function') {
          setSuggestion(prev => update(prev));
        } else {
          setSuggestion(update);
        }
      },
      () => {
        ruleRef.current?.blur();
        contentRef.current?.focus();
      }
    );
  };

  useWriterKeyboardShortcuts(contentRef, handleQuery);

  const applySuggestion = () => {
    if (suggestion.pending || !current) return;
    const { pos, res } = suggestion;
    const _res = removeDuplicateString(contentRef.current.value.substr(0, pos[0]), res);
    replaceRange(contentRef.current, pos[0], pos[1], _res);
    writerSessions.updateContent(current.id, contentRef.current.value);
    setSuggestion({ res: '' });
  };

  const handleEditTitle = (id) => {
    const session = sessions.find(s => s.id === id);
    Dialog.prompt({
      message: '新しいタイトル',
      defaultValue: session?.title || '',
      onConfirm: (newTitle) => {
        if (newTitle !== null && newTitle !== undefined) {
          writerSessions.updateTitle(id, newTitle);
        }
      }
    });
  };

  const handleDeleteSession = (id) => {
    Dialog.confirm({
      message: '本当に削除しますか？',
      onConfirm: () => {
        writerSessions.deleteSession(id);
      }
    });
  };

  return (
    <div className={`writer ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 左サイドバー：セッション一覧 */}
      <aside className="writer__sidebar">
        <div className="writer__sidebar-header">
          <button className="writer__add-btn" onClick={handleNewSession}>
            ＋ 新規作成
          </button>
        </div>
        <h2 className="writer__section-title">セッション一覧</h2>
        <ul className="writer__list">
          {sessions.map(s => (
            <li
              key={s.id}
              className={`writer__list-item ${s.id === selectedId ? 'active' : ''}`}
            >
              <button
                className="writer__title-btn"
                onClick={() => writerSessions.setSelectedSession(s.id)}
              >
                {s.title}
              </button>
              <div className="writer__item-actions">
                <button className="writer__edit-btn" onClick={() => handleEditTitle(s.id)}>
                  ✎
                </button>
                <button className="writer__del-btn" onClick={() => handleDeleteSession(s.id)}>
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 中メイン：会話内容入力 */}
      <main className="writer__main">
        {current ? (
          <>
            <h2 className="writer__section-title">
              会話内容
              <div className="markdown-btn" onClick={() => setShowMarkdown(!showMarkdown)}>
                {showMarkdown ? 'text' : 'markdown'}
              </div>
            </h2>
            {showMarkdown ? (
              <MarkdownViewer className="writer__markdown" content={current.content} />
            ) : (
              <textarea
                ref={contentRef}
                className="writer__textarea"
                placeholder="会話内容を入力してください..."
                value={current.content}
                onMouseOver={e => e.target.focus()}
                onChange={e => writerSessions.updateContent(current.id, e.target.value)}
              />
            )}
          </>
        ) : (
          <p className="writer__placeholder">セッションを選択してください。</p>
        )}
      </main>

      {/* 右サイド：操作説明 + 補助書き込み規則 */}
      <aside className="writer__aside">
        {current && (
          <section className="writer__rule">
            <h2 className="writer__section-title">補助書き込み規則</h2>
            <textarea
              ref={ruleRef}
              className="writer__textarea"
              placeholder="規則を入力してください..."
              value={current.rule}
              onMouseOver={e => e.target.focus()}
              onChange={e => writerSessions.updateRule(current.id, e.target.value)}
            />
          </section>
        )}
        {suggestion.pending || suggestion.res ? (
          <div
            className={['suggestion', !suggestion.pending && 'active'].filter(Boolean).join(' ')}
            onClick={applySuggestion}
          >
            {suggestion.pending && <p>pending..</p>}
            <p>{suggestion.res}</p>
          </div>
        ) : (
          <section className="writer__instructions">
            <h2 className="writer__section-title">操作説明</h2>
            <ul className="writer__inst-list">
              <li>
                Press <b>Ctrl+I</b> to generate suggestions after the cursor.
              </li>
              <li>
                Press <b>Ctrl+R</b> (with a selection) to generate replacement suggestions.
              </li>
              <li>
                Press <b>Ctrl+J</b> (with a selection) to expand the user's requirements into a
                more precise and detailed list..
              </li>
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}
