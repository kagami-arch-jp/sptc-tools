/**
 * @file Tool.jsx
 * @description AIツールポータルのメインページコンポーネント。
 * @version 1.0.0
 * @create 2026/04/14
 * @features ツール一覧表示, ヒーローセクション, ダークモード対応, ヘッダーナビゲーション
 * @usage <Tool />
 */

import React, { useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import {useDarkMode} from '@/store/globalSettingStore'
import toolStore, { reorderTools, TOOLS_DATA, settingKey, config } from '@/store/toolStore'
import SortableToolCard from './ToolCard/SortableToolCard';
import { checkAlive } from '@/api/alive';
import Dialog from '@/components/Dialog';
import { ModalButton } from '@/components/Modal';
import SettingPanelCommon from '@/components/SettingPanelCommon';

import './index.scss';

const Tool = () => {
  const isDarkMode = useDarkMode();
  const toolOrder = toolStore.useValue().toolOrder;

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 10,
      tolerance: 5,
    },
  });
  const sensors = useSensors(pointerSensor);

  useEffect(() => {
    let cancelled = false;
    let timerId = null;

    let networkErrorShown = false;

    const poll = async () => {
      while (!cancelled) {
        try {
          await checkAlive(()=>{
            if (networkErrorShown) {
              Dialog.close();
              networkErrorShown = false;
            }
          });
        } catch (e) {
          if (!networkErrorShown) {
            Dialog.loading();
            networkErrorShown = true;
          }
        }
        await new Promise(resolve => {
          timerId = setTimeout(resolve, 1000);
        });
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

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
      <div className="tool-header">
        <div className="tool-header-right">
          <ModalButton id="tool-global-config" className="config-button" text="⚙ 全局配置">
            <SettingPanelCommon settingKey={settingKey} config={config} title="ツール全体設定" />
          </ModalButton>
        </div>
      </div>

      <main className="tool-main-content">

        <section className="tools-grid-section">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
