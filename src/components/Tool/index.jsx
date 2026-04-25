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

import {getSubSettingStore} from '@/store/settingStore'

import ImageGenerator from './tools/ImageGenerator'
import Writer from './tools/Writer'
import Reader from './tools/Reader'
import TodoList from './tools/TodoList'

import ChatBot from './tools/ChatBot'
import {chatSettingStore} from '@/store/chatStore'

const TOOLS_DATA = [
  {
    id: 2,
    name: 'Image Generator',
    description: 'テキストから写真を生成',
    image: *IMG('./imgs/imageGenerator.png'),
    Component: <ImageGenerator />,
  },
  {
    id: 3,
    name: 'Writer',
    description: '執筆アシスタント',
    image: *IMG('./imgs/writer.png'),
    Component: <Writer />,
  },
  {
    id: 4,
    name: 'Reader',
    description: '日本語を繰り返して読む',
    image: *IMG('./imgs/reader.png'),
    Component: <Reader />,
  },
  {
    id: 5,
    name: 'TodoList',
    description: 'これからやるべきことを',
    image: *IMG('./imgs/todoList.png'),
    Component: <TodoList />,
  },
  {
    id: 7,
    name: 'Mr.ChatBot',
    description: '普通な会話練習',
    image: *IMG('./imgs/chatBot.png'),
    Component: <ChatBot />,
    SettingBtn: <ModalButton id='chatBot-settingPanel' text='⚙️'>
      <SettingPanel store={chatSettingStore} />
    </ModalButton>,
  }
];

const Tool = () => {

  const isDarkMode = darkMode.useValue();
  return (
    <div className={`tool-page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="tool-header">
        <h1 className="tool-title">AI Portal</h1>
        <div className="tool-header-actions">
          <ModalButton id='setting-panel' className='setting-button' text='⚙️'>
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
