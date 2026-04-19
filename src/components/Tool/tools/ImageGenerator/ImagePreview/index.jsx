/**
 * @file ImagePreview/index.jsx
 * @description 生成された画像のプレビューを表示するコンポーint。
 * @created 2026-04-14
 */

import React from 'react';
import {imageGenerationStore} from '@/store/imageGenerationStore';
import './index.scss';

function ImagePreview() {
  const {imageUrl, status} = imageGenerationStore.useValue()

  return (
    <div className="image-preview-container">
      {status === 'loading' && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {imageUrl ? (
        <div className="image-wrapper">
          <img
            src={imageUrl}
            alt="Generated content"
            className="generated-image"
          />
        </div>
      ) : (
        <div className="empty-placeholder">
          {status === 'idle' ? 'パラメータを設定して生成を開始してください' : ''}
        </div>
      )}
    </div>
  );
}

export default ImagePreview;
