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
import ModalButton from '@/components/ModalButton';
import SettingPanel from './SettingPanel';
import './index.scss';

import CodeAgent from './Tools/CodeAgent'
import ImageGenerator from './Tools/ImageGenerator'
import Writer from './Tools/Writer'
import Reader from './Tools/Reader'
import TodoList from './Tools/TodoList'
import Reviewer from './Tools/Reviewer'

const TOOLS_DATA = [
  {
    id: 1,
    name: 'Code Agent',
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
  },
  {
    id: 4,
    name: 'Reader',
    description: '日本語を繰り返して読む',
    image: *IMG('./imgs/reader.png'),
    alt: 'A speaker contains a magical chip; whispering into it allows for conversations across time and space. It not only amplifies sound but also captures faint echoes forgotten deep in the past. **Disney-style**',
    Component: <Reader />,
  },
  {
    id: 5,
    name: 'TodoList',
    description: 'これからやるべきことを',
    image: *IMG('./imgs/todoList.png'),
    alt: 'Inside the old house, sunlight streamed in through the window. On the wooden desk sat a yellow notebook, closed, with a pencil resting on top. It had a certain vintage feel. The artwork was painted in a Disney style.',
    Component: <TodoList />,
  },
  {
    id: 6,
    name: 'Answer',
    description: 'ドキュメントについて質問を回答する',
    image: *IMG('./imgs/reviewer.png'),
    alt: 'At a computer desk, a robot from the last century is reading a newspaper. Please use a **cyberpunk** style.',
    Component: <Reviewer />,
  }
];

const Tool = () => {

  const isDarkMode = darkMode.useValue();

  return (
    <div className={`tool-page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="tool-header">
        <h1 className="tool-title">AI Portal</h1>
        <div className="tool-header-actions">
          <ModalButton className='setting-button' text='⚙️'>
            <SettingPanel />
          </ModalButton>
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
