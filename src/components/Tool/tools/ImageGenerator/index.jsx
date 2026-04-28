/**
 * @file ImageGenerator/index.jsx
 * @description 画像生成のメインコンポーネント。プロンプト入力、パラメータ設定、生成プロセスを制御します。
 * @feature
 * - プロンプト入力
 * - 画像サイズ・ステップ数設定
 * - 非同期画像生成プロセス管理
 * @created 2026-04-14
 * @usage <ImageGenerator />
 */

import React, { useCallback } from 'react';
import { generateImage } from '@/api/imageApi';
import {
  imageGenerationStore,
  imageGenerationSettingStore,
  panelSettingKey,
  panelConfig,
} from '@/store/imageGenerationStore'
import SettingPanelCommon from '@/components/SettingPanelCommon';
import ProgressDisplay from './ProgressDisplay';
import ImagePreview from './ImagePreview';
import './index.scss';
import SizeObserver from '@/components/SizeObserver'
import Dialog from '@/components/Dialog'

function ImageGenerator() {
  const [settings, setSettings] = imageGenerationSettingStore.use();
  const [store, setStore] = imageGenerationStore.use();

  const { prompt, size, steps } = settings;

  const handleGenerate = useCallback(async () => {
    if (!prompt || !prompt.trim()) {
      Dialog.toast({ message: 'プロンプトを入力してください' });
      return;
    }

    setStore({ ...store, status: 'loading', progress: 0, imageUrl: null });

    try {
      await generateImage({ prompt, size, steps }, (progress, image)=>{
        if(!image) {
          setStore(prev => ({ ...prev, progress }))
        }else{
          setStore({ status: 'success', progress: 100, imageUrl: 'data:image/jpeg;base64,'+image });
        }
      });
    } catch (error) {
      setStore({ status: 'error', progress: 0, imageUrl: null });
      console.error('Generation error:', error);
    }
  }, [prompt, size, steps, settings]);

  const handleCancel = () => {
    setStore({ ...store, status: 'idle', progress: 0, imageUrl: null });
  };

  return (
    <SizeObserver getClassName={e=>{
      if(e.width<450) return 'small'
      return ''
    }} className="image-generator-container">
      <div className="generator-card">
        <SettingPanelCommon
          showGlobalSettings={false}
          settingKey={panelSettingKey}
          config={panelConfig}
          title="画像生成設定"
        />

        <div className="action-group">
          {store.status === 'loading' ? (
            <button className="btn btn-cancel" onClick={handleCancel} disabled={false}>
              生成をキャンセル
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={store.status === 'loading'}
            >
              画像を生成する
            </button>
          )}
        </div>

      </div>
      <div className="generator-card">
        <div className="display-area">
          <ProgressDisplay />
          <ImagePreview />
        </div>
      </div>
    </SizeObserver>
  );
}

export default ImageGenerator;
