/**
 * @file Tool.jsx
 * @description AIツールポータルのメインページコンポーネント。
 * @version 1.0.0
 * @create 2026/04/14
 * @features ツール一覧表示, ヒーローセクション, ダークモード対応, ヘッダーナビゲーション
 * @usage <Tool />
 */

import React from 'react';
import {useDarkMode} from '@/store/globalSettingStore'
import ToolCard from './ToolCard';

import './index.scss';

//import ImageGenerator from './tools/ImageGenerator'
//import Writer from './tools/Writer'

import TodoList from './tools/TodoList'
import {config as todoConfig, settingKey as todoSettingKey} from '@/store/todoStore'

import ChatBot from './tools/ChatBot'
import {config as chatConfig, settingKey as chatSettingKey} from '@/store/chatStore'

const TOOLS_DATA = [
  /*{
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
  },*/
  {
    id: 5,
    name: 'TodoList',
    description: 'これからやるべきことを',
    image: *IMG('./imgs/todoList.png'),
    Component: <TodoList />,
    settingKey: todoSettingKey,
    config: todoConfig,
  },
  {
    id: 7,
    name: 'Mr.ChatBot',
    description: '普通な会話練習',
    image: *IMG('./imgs/chatBot.png'),
    Component: <ChatBot />,

    settingKey: chatSettingKey,
    config: chatConfig,
  }
];

const Tool = () => {

  const isDarkMode = useDarkMode();
  return (
    <div className={`tool-page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="tool-header">
        <h1 className="tool-title">AI Portal</h1>
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
