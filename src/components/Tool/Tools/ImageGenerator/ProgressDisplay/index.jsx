/**
 * @file ProgressDisplay/index.jsx
 * @description 生成の進捗状況を視覚的に表示するコンポーネント。
 * @created 2026-04-14
 */

import React from 'react';
import {imageGenerationStore} from '@/store/imageGenerationStore';
import './index.scss';

function ProgressDisplay() {
  const {status, progress} = imageGenerationStore.useValue();

  if (status === 'idle' || status === 'success' || status === 'error') {
    return null;
  }

  return (
    <div className="progress-container">
      <div className="progress-text">生成中... {progress}%</div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressDisplay;
