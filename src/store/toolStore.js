import { createStoreSharedState } from './storage';
import { getCommonSettingStore } from '@/store/commonSettingStore';


import React from 'react'
import ImageGenerator from '@/components/Tool/tools/ImageGenerator'
import {config as imageGeneratorConfig, settingKey as imageGeneratorSettingKey} from '@/store/imageGenerationStore'

import Writer from '@/components/Tool/tools/Writer'
import {config as writerConfig, settingKey as writerSettingKey} from '@/store/writerStore'

import TodoList from '@/components/Tool/tools/TodoList'
import {config as todoConfig, settingKey as todoSettingKey} from '@/store/todoStore'

import ChatBot from '@/components/Tool/tools/ChatBot'
import {config as chatConfig, settingKey as chatSettingKey} from '@/store/chatStore'

export const TOOLS_DATA = [
  {
    id: 2,
    name: 'Image Generator',
    description: 'テキストから写真を生成',
    image: *IMG('@/components/Tool/imgs/imageGenerator.png'),
    Component: <ImageGenerator />,
    settingKey: imageGeneratorSettingKey,
    config: imageGeneratorConfig,
  },
  {
    id: 3,
    name: 'Writer',
    description: '執筆アシスタント',
    image: *IMG('@/components/Tool/imgs/writer.png'),
    Component: <Writer />,
    settingKey: writerSettingKey,
    config: writerConfig,
  },
  {
    id: 5,
    name: 'TodoList',
    description: 'これからやるべきことを',
    image: *IMG('@/components/Tool/imgs/todoList.png'),
    Component: <TodoList />,
    settingKey: todoSettingKey,
    config: todoConfig,
  },
  {
    id: 7,
    name: 'Mr.ChatBot',
    description: '普通な会話練習',
    image: *IMG('@/components/Tool/imgs/chatBot.png'),
    Component: <ChatBot />,

    settingKey: chatSettingKey,
    config: chatConfig,
  }
];

const toolStore = createStoreSharedState('tool-btns', {
  toolOrder: TOOLS_DATA.map(x=>x.id),
})

export const settingKey='toolStore-setting'
export const config=[
  {
    key: 'autoOpenTool',
    type: 'select',
    info: '自動的に開くツール',
    selection: [
      { name: 'none', value: 'なし' },
      ...TOOLS_DATA.map(x=>({
        name: x.id,
        value: x.name,
      }))
    ]
  }
]

export const settingConfig=getCommonSettingStore(settingKey);

export const reorderTools = (newOrder) => {
  toolStore.setValue({toolOrder: newOrder})
}

export default toolStore
