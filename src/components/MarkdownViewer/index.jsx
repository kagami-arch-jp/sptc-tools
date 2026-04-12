/**
 * MarkdownViewer コンポーネント
 * 
 * 機能:
 * - Markdown形式のテキストをHTMLにレンダリング
 * - 表(Table)を含むGFM構文のサポート
 * - 全体コピー機能
 * - ダークモード対応
 * 
 * 作成日: 2026-04-13
 * 呼び出し方: <MarkdownViewer content="## Hello" copyAll={true} copyCode={true} />
 */
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { darkMode } from '@/store/darkMode';
import { copyToClipboard } from '@/utils/base';
import CodeBlock from './CodeBlock';
import './index.scss';

const MarkdownViewer = ({ content, copyAll = false, copyCode = false }) => {
  const isDarkMode = darkMode.useValue();
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      await copyToClipboard(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className={`markdown-viewer-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {copyAll && (
        <div className="toolbar">
          <button 
            className="copy-all-btn" 
            onClick={handleCopyAll}
          >
            {copied ? 'コピー完了' : 'すべてコピー'}
          </button>
        </div>
      )}
      <div className="markdown-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <CodeBlock 
                  language={match ? match[1] : 'text'} 
                  value={String(children).replace(/\n$/, '')} 
                  copyCode={copyCode}
                  {...props} 
                />
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownViewer;