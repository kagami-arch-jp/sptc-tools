/**
 * @file Tool.jsx
 * @description AIツールポータルのメインページコンポーネント。
 * @version 1.0.0
 * @create 2026/04/14
 * @features ツール一覧表示, ヒーローセクション, ダークモード対応, ヘッダーナビゲーション
 * @usage <Tool />
 */

import React from 'react';
import { darkMode } from '@/store/darkMode';
import ToolCard from './ToolCard';

// 既存のコンポーネントを想定
import SettingButton from '@/components/SettingButton';
import './index.scss';

import CodeAgent from '@/components/CodeAgent'

const TOOLS_DATA = [
  {
    id: 1,
    name: 'AI Code Architect',
    description: 'PRDからコードに実装',
    image: 'example.png',
    alt: 'A futuristic digital landscape with neon lights and floating islands, high resolution, cinematic lighting',
    Component: <CodeAgent />,
  }
];

const Tool = () => {
  const isDarkMode = darkMode.useValue();

  return (
    <div className={`tool-page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="tool-header">
        <h1 className="tool-title">AI Portal</h1>
        <div className="tool-header-actions">
          <SettingButton />
        </div>
      </header>

      <main className="tool-main-content">

        <section className="tools-grid-section">
          <div className="tools-grid">
            {TOOLS_DATA.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Tool;
