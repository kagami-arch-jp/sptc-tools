/**
 * CodeBlock コンポーネント
 *
 * 機能:
 * - シンタックスハイライト付きのコード表示
 * - 個別コードブロックのコピー機能
 * - ダークモード対応
 *
 * 作成日: 2026-04-13
 */
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import duotoneLight from 'react-syntax-highlighter/dist/esm/styles/prism/duotone-light';
import duotoneForest from 'react-syntax-highlighter/dist/esm/styles/prism/duotone-forest';

import { useDarkMode } from '@/store/globalSettingStore';
import { copyToClipboard } from '@/utils/base';
import './index.scss';

const CodeBlock = ({ language, value, copyCode }) => {
  const isDarkMode = useDarkMode();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className={`code-block-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {copyCode && (
        <button className="copy-code-btn" onClick={handleCopy}>
          {copied ? '完了' : 'コピー'}
        </button>
      )}
      <SyntaxHighlighter
        language={language}
        style={isDarkMode ? duotoneForest: duotoneLight}
        customStyle={{ margin: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
