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

import React, { useState, useCallback } from 'react';
import { generateImage } from '@/api/imageApi';
import {
  imageGenerationStore,
  promptStore,
  sizeStore,
  stepsStore,
} from '@/store/imageGenerationStore'
import ProgressDisplay from './ProgressDisplay';
import ImagePreview from './ImagePreview';
import './index.scss';
import SizeObserver from '@/components/SizeObserver'

function ImageGenerator() {
  const [prompt, setPrompt] = promptStore.use()
  const [size, setSize] = sizeStore.use()
  const [steps, setSteps] = stepsStore.use()
  const [store, setStore] = imageGenerationStore.use();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert('プロンプトを入力してください');
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
  }, [prompt, size, steps, setStore]);

  const handleCancel = () => {
    setStore({ ...store, status: 'idle', progress: 0, imageUrl: null });
  };

  return (
    <SizeObserver getClassName={e=>{
      if(e.width<450) return 'small'
      return ''
    }} className="image-generator-container">
      <div className="generator-card">
        <div className="input-group textarea-area">
          <label className="input-label">プロンプト</label>
          <textarea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="生成したい画像の内容を詳しく入力してください..."
            disabled={store.status === 'loading'}
          />
        </div>

        <div className="parameter-group">
          <div className="slider-item">
            <div className="slider-header">
              <span className="slider-label">画像サイズ</span>
              <span className="slider-value">{size}px</span>
            </div>
            <input
              type="range"
              min="64"
              max="1024"
              step="64"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="custom-slider"
              disabled={store.status === 'loading'}
            />
          </div>

          <div className="slider-item">
            <div className="slider-header">
              <span className="slider-label">ステップ数</span>
              <span className="slider-value">{steps}</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="custom-slider"
              disabled={store.status === 'loading'}
            />
          </div>
        </div>

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
