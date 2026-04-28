/**
 * @file Image Generation Store
 * @description 画像生成のグローバル状態管理
 * @create 2026-04-14
 */

import { createStoreSharedState } from './storage';
import createSharedState from 'react-cross-component-state';
import {getCommonSettingStore} from '@/store/commonSettingStore'
import {fetchModels} from '@/api/settings'

export const settingKey='ImageGenerator-SettingsV1'
export const config=[
  {
    key: 'useApiKey',
    type: 'checkbox',
    info: 'オンラインモードを有効にする',
    children: [
      {
        key: 'apiKey',
        type: 'password',
        info: 'API Key',
      }
    ]
  },
  {
    key: 'onlineModals',
    type: 'select',
    info: 'イメージモデル(online)',
    selection: async (state, oldValue)=>{
      if(oldValue?.key===state.apiKey && oldValue?.data?.length) return oldValue
      const modals=await fetchModels(state.useApiKey && state.apiKey || '/')
      return {
        key: state.apiKey,
        data: modals.map(({name})=>({name, value: name})),
      }
    },
    hide: state=>{
      return !(state.useApiKey && state.apiKey)
    },
  },
  {
    key: 'localModals',
    type: 'select',
    info: 'イメージモデル(local)',
    selection: async (state, oldValue)=>{
      if(oldValue?.data?.length) return oldValue
      const modals=await fetchModels()
      return {
        key: state.apiKey,
        data: modals.map(({name})=>({name, value: name})),
      }
    },
    hide: state=>{
      return state.useApiKey && state.apiKey
    },
  },
]

export const panelSettingKey='ImageGenerator-PanelSettingsV1'
export const panelConfig=[
  {
    key: 'prompt',
    type: 'textarea',
    info: 'プロンプト',
    placeholder: '生成したい画像の内容を詳しく入力してください...',
    rows: 4,
  },
  {
    key: 'size',
    type: 'range',
    info: '画像サイズ',
    min: 64,
    max: 1024,
    step: 64,
    show: value=>`${value}px`,
  },
  {
    key: 'steps',
    type: 'range',
    info: 'ステップ数',
    min: 1,
    max: 25,
    step: 1,
  },
]

export const imageGenerationSettingStore=getCommonSettingStore(settingKey)

export const imageGenerationStore = createSharedState({
  progress: 0,
  imageUrl: null,
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
});
