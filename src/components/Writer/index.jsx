import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import {
  getSelectionInfo,
  replaceRange,
  removeDuplicateString,
} from '@/utils/textSelection';
import {querySuggestion} from '@/api/writer'
import {writerSessions} from '@/store/writer'
import MarkdownViewer from '@/components/MarkdownViewer'

export default function Writer() {
  const [{ sessions, selectedId }, setState] = writerSessions.use();
  const contentRef = useRef(null);
  const ruleRef = useRef(null);

  const [suggestion, setSuggestion]=useState({
    pending: false,
    timestamp: 0,
    res: '',
    pos: [0, 0],
  })

  async function doQuery(txt, queryType, pos) {
    const timestamp=Date.now()
    setSuggestion({
      pending: true,
      timestamp,
      res: '',
      pos,
    })

    await querySuggestion({
      txt,
      role: ruleRef.current.value.trim(),
      queryType,
    }, t=>{
      setSuggestion(prevState=>{
        if(prevState.timestamp>timestamp) return prevState
        return {
          ...prevState,
          res: prevState.res+t,
        }
      })
    })
    setSuggestion(prevState=>{
      if(prevState.timestamp>timestamp) return prevState
      return {
        ...prevState,
        pending: false,
      }
    })
  }

  function applySuggestion() {
    if(suggestion.pending) return;
    const {pos, res}=suggestion
    const _res=removeDuplicateString(contentRef.current.value.substr(0, pos[0]), res)
    replaceRange(contentRef.current, pos[0], pos[1], _res)
    updateContent(current.id, contentRef.current.value)
    setSuggestion({res: ''})
  }

  // ---- キーリスナ -------------------------------------------------
  useEffect(() => {
    const handler = e => {
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        const {selectedText, end}=getSelectionInfo(contentRef.current)
        const headTxt=selectedText || contentRef.current.value.substr(0, end)
        headTxt && doQuery(headTxt, 'after', [end, end])
      }
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        const {selectedText, start, end}=getSelectionInfo(contentRef.current)
        selectedText && doQuery(selectedText, 'rewrite', [start, end])
      }
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        const {selectedText, start, end}=getSelectionInfo(contentRef.current)
        selectedText && doQuery(selectedText, 'expand', [start, end])
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ---- セッション操作 -----------------------------------------------
  const addSession = () => {
    const now = new Date();
    const title = now.toLocaleString();
    const newSession = {
      id: `${Date.now()}`,
      title,
      content: '',
      rule: '',
    };
    setState(prev => ({
      sessions: [...prev.sessions, newSession],
      selectedId: newSession.id,
    }));
  };

  const selectSession = id => {
    setState(prev => ({ ...prev, selectedId: id }));
  };

  const editTitle = (id, newTitle) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s =>
        s.id === id ? { ...s, title: newTitle } : s
      ),
    }));
  };

  const deleteSession = id => {
    if (!window.confirm('本当に削除しますか？')) return;
    setState(prev => {
      const remaining = prev.sessions.filter(s => s.id !== id);
      const newSelected = remaining.length
        ? remaining[0].id
        : '';
      return { sessions: remaining, selectedId: newSelected };
    });
  };

  const updateContent = (id, value) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s =>
        s.id === id ? { ...s, content: value } : s
      ),
    }));
  };

  const updateRule = (id, value) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s =>
        s.id === id ? { ...s, rule: value } : s
      ),
    }));
  };

  // ---- 現在選択中のセッション取得 ---------------------------------
  const current = sessions.find(s => s.id === selectedId);

  const [showMarkdown, setShowMarkdown]=useState(false)

  // ---- UI -----------------------------------------------------------
  return (
    <div className="writer">
      {/* 左サイドバー：セッション一覧 */}
      <aside className="writer__sidebar">
        <h2 className="writer__section-title">会話一覧</h2>
        <ul className="writer__list">
          {sessions.map(s => (
            <li
              key={s.id}
              className={`writer__list-item ${
                s.id === selectedId ? 'active' : ''
              }`}
            >
              <button
                className="writer__title-btn"
                onClick={() => selectSession(s.id)}
              >
                {s.title}
              </button>
              <div className="writer__item-actions">
                <button
                  className="writer__edit-btn"
                  onClick={() => {
                    const newTitle = prompt('新しいタイトル', s.title);
                    if (newTitle !== null) editTitle(s.id, newTitle);
                  }}
                >
                  ✎
                </button>
                <button
                  className="writer__del-btn"
                  onClick={() => deleteSession(s.id)}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button className="writer__add-btn" onClick={addSession}>
          ＋ 新規作成
        </button>
      </aside>

      {/* 中メイン：会話内容入力 */}
      <main className="writer__main">
        {current ? (
          <>
            <h2 className="writer__section-title">
              会話内容
              <div className='markdown-btn' onClick={()=>{
                setShowMarkdown(!showMarkdown)
              }}>{showMarkdown? 'text': 'markdown'}</div>
            </h2>
            {showMarkdown?
              <MarkdownViewer className='writer__markdown' content={current.content} />:
              <textarea
                ref={contentRef}
                className="writer__textarea"
                placeholder="会話内容を入力してください..."
                value={current.content}
                onMouseOver={e=>e.target.focus()}
                onChange={e => updateContent(current.id, e.target.value)}
              />
            }
          </>
        ) : (
          <p className="writer__placeholder">会話を選択してください。</p>
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
              onMouseOver={e=>e.target.focus()}
              onChange={e => updateRule(current.id, e.target.value)}
            />
          </section>
        )}
        {(suggestion.pending || suggestion.res)? <div className={['suggestion', !suggestion.pending && 'active'].filter(Boolean).join(' ')} onClick={applySuggestion}>
          {suggestion.pending && <p>pending..</p>}
          <p>{suggestion.res}</p>
        </div>: <section className="writer__instructions">
          <h2 className="writer__section-title">操作説明</h2>
          <ul className="writer__inst-list">
            <li>Press <b>Ctrl+I</b> to generate suggestions after the cursor.</li>
            <li>Press <b>Ctrl+R</b> (with a selection) to generate replacement suggestions.</li>
            <li>Press <b>Ctrl+J</b> (with a selection) to expand the user's requirements into a more precise and detailed list..</li>
          </ul>
        </section>}
      </aside>
    </div>
  );
}
