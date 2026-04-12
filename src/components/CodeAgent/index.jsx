/**
 * @description コード生成エージェントコンポーネント。要件入力、分析生成、コード生成、ファイル書き込み機能を提供します。
 * @created 2026/04/13
 * @usage <CodeAgent />
 */
import React, { useState } from 'react';
import { darkMode } from '@/store/darkMode';
import { analyzeRequirement, generateCode, writeToFile, getWorkdir } from '@/api/codeAgent';
import MarkdownViewer from '@/components/MarkdownViewer';
import CodeFiles from './CodeFiles';
import './index.scss';

import {useStorageValue} from '@/hooks/useStorageValue'

function parseCodeFiles(str) {
  const p={}
  let _fn=null
  str.replace(/\*\*(.+?)\*\*|```(jsx?|s?css|javascript|js)\s*([\s\S]+?)```(\n|$)/g, (_, fn, lang, code)=>{
    if(fn) _fn=fn.trim()
    else p[_fn]={lang, code: code.trim()}
  })
  return p
}

export default function CodeAgent() {
  const isDarkMode = darkMode.useValue();
  const [inputtext, setInputtext] = useStorageValue('codeAgent.requirement', '');
  const [isPreview, setIsPreview] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState({ analyze: false, generate: false, write: false });
  const [codeFiles, setCodeFiles]=useState(null)

  const [workdir, setWorkdir]=useState(null)

  const rightPanelRef=React.useRef(null)

  function clear() {
    setResult('')
    setCodeFiles(null)
  }

  const handleAnalyze = async () => {
    if (!inputtext) return alert('要件を入力してください');
    setLoading(prev => ({ ...prev, analyze: true }));
    clear()
    try {
      await analyzeRequirement(inputtext, (txt, d)=>{
        setResult(x=>x+txt)
      });
    } catch (e) {
      alert('分析中にエラーが発生しました');
    } finally {
      setLoading(prev => ({ ...prev, analyze: false }));
    }
  };

  const handleGenerate = async () => {
    if (!inputtext) return alert('要件を入力してください');
    setLoading(prev => ({ ...prev, generate: true }));
    clear()
    try {
      await generateCode(inputtext, (txt, d)=>{
        setResult(x=>x+txt)
      });
      setResult(result=>{
        setCodeFiles(parseCodeFiles(result))
        return ''
      })
    } catch (e) {
      alert('コード生成中にエラーが発生しました');
    } finally {
      setLoading(prev => ({ ...prev, generate: false }));
    }
  };

  const handleWrite = async () => {
    if (!codeFiles) return alert('書き込むコードがありません');
    setLoading(prev => ({ ...prev, write: true }));
    try {
      const msg=await writeToFile(codeFiles);
      setCodeFiles(null)
      alert(msg);
    } catch (e) {
      console.log(e)
      alert('書き込み中にエラーが発生しました');
    } finally {
      setLoading(prev => ({ ...prev, write: false }));
    }
  };

  React.useEffect(()=>{
    rightPanelRef.current.scrollTop=9e9
  }, [result, codeFiles])

  React.useEffect(()=>{
    getWorkdir().then(dir=>setWorkdir(dir))
  }, [])

  return (
    <div className={`code-agent-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1 className="main-title">AI Code Architect</h1>
      <p className="workdir">workdir: {workdir || 'loading..'}</p>
      <div className="main-content">
        <div className="left-panel">
          <div className="input-wrapper">
            <div className="toolbar">
              <button
                className="btn"
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? '編集' : 'プレビュー'}
              </button>
            </div>
            {!isPreview ? (
              <textarea
                className="requirement-input"
                value={inputtext}
                onChange={(e) => setInputtext(e.target.value)}
                placeholder="ここに要件を入力してください..."
              />
            ) : (
              <MarkdownViewer content={inputtext} />
            )}
          </div>

          <div className="action-bar">
            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={loading.analyze}
            >
              {loading.analyze ? '分析中...' : '要件分析を生成'}
            </button>
            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading.generate}
            >
              {loading.generate ? '生成中...' : 'コードを生成'}
            </button>
            <button
              className="btn-secondary"
              onClick={handleWrite}
              disabled={loading.write || !codeFiles}
            >
              {loading.write ? '書き込み中...' : 'ファイルに書き込む'}
            </button>
          </div>
        </div>

        <div className="right-panel" ref={rightPanelRef}>
          {(()=>{
            if((loading.analyze || loading.generate) && !result) {
              return <div className="loading-state">読み込み中...</div>
            }
            if(codeFiles) {
              return <CodeFiles codeFiles={codeFiles} />
            }
            if(result) {
              return <MarkdownViewer copyAll={true} content={result} />
            }
            return <div className="empty-state">
              <p>下のボタンをクリックして、分析またはコード生成を開始してください</p>
            </div>
          })()}
        </div>
      </div>
    </div>
  );
}
