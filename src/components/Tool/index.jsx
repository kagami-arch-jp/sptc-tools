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
import ImageGenerator from '@/components/ImageGenerator'
import Writer from '@/components/Writer'

const TOOLS_DATA = [
  {
    id: 1,
    name: 'AI Code Architect',
    description: 'PRDからコードに実装',
    image: *IMG('./imgs/codeAgent.png'),
    alt: 'A futuristic digital landscape with neon lights and floating islands, high resolution, cinematic lighting',
    Component: <CodeAgent />,
  },
  {
    id: 2,
    name: 'Image Generator',
    description: 'テキストから写真を生成',
    image: *IMG('./imgs/imageGenerator.png'),
    alt: 'A black cosmic background with a colored pencil drawing a rainbow.',
    Component: <ImageGenerator />,
  },
  {
    id: 3,
    name: 'Writer',
    description: '執筆アシスタント',
    image: *IMG('./imgs/writer.png'),
    alt: 'After a summer rain, a thin mist hangs in the air of the rainforest, filled with the fragrance of earth and decaying plants. Glistening raindrops slide slowly down the massive broadleaf leaves, dripping into the thick layer of fallen leaves below with a soft "plop." Sunlight penetrates the layers of the canopy, forming clear beams that illuminate the insects flitting about and the damp moss. From the depths of the distant forest, the occasional clear bird song breaks the vibrant yet tranquil atmosphere.',
    Component: <Writer />,
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
