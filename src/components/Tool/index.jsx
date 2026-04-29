/**
 * @file Tool.jsx
 * @description AIツールポータルのメインページコンポーネント。
 * @version 1.0.0
 * @create 2026/04/14
 * @features ツール一覧表示, ヒーローセクション, ダークモード対応, ヘッダーナビゲーション
 * @usage <Tool />
 */

import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import {useDarkMode} from '@/store/globalSettingStore'
import toolStore, { reorderTools } from '@/store/toolStore'
import SortableToolCard from './ToolCard/SortableToolCard';

import './index.scss';

import ImageGenerator from './tools/ImageGenerator'
import {config as imageGeneratorConfig, settingKey as imageGeneratorSettingKey} from '@/store/imageGenerationStore'

import Writer from './tools/Writer'
import {config as writerConfig, settingKey as writerSettingKey} from '@/store/writerStore'

import TodoList from './tools/TodoList'
import {config as todoConfig, settingKey as todoSettingKey} from '@/store/todoStore'

import ChatBot from './tools/ChatBot'
import {config as chatConfig, settingKey as chatSettingKey} from '@/store/chatStore'

const TOOLS_DATA = [
  {
    id: 2,
    name: 'Image Generator',
    description: 'テキストから写真を生成',
    image: *IMG('./imgs/imageGenerator.png'),
    Component: <ImageGenerator />,
    settingKey: imageGeneratorSettingKey,
    config: imageGeneratorConfig,
  },
  {
    id: 3,
    name: 'Writer',
    description: '執筆アシスタント',
    image: *IMG('./imgs/writer.png'),
    Component: <Writer />,
    settingKey: writerSettingKey,
    config: writerConfig,
  },
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
  const toolOrder = toolStore.useValue().toolOrder;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = toolOrder.indexOf(active.id);
      const newIndex = toolOrder.indexOf(over.id);
      const newOrder = arrayMove(toolOrder, oldIndex, newIndex);
      reorderTools(newOrder);
    }
  };

  const sortedTools = toolOrder
    .map(id => TOOLS_DATA.find(tool => tool.id === id))
    .filter(Boolean);

  return (
    <div className={`tool-page-container ${isDarkMode ? 'dark-mode' : ''}`}>

      <main className="tool-main-content">

        <section className="tools-grid-section">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={toolOrder} strategy={horizontalListSortingStrategy}>
              <div className="tools-grid">
                {sortedTools.map((tool) => (
                  <SortableToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      </main>
    </div>
  );
};

export default Tool;
