/**
 * @file ResizeHandle component
 * @description ウィンドウ右下のリサイズ用ハンドル
 * @created 2026/04/14
 * @usage <ResizeHandle onResizeStart={...} />
 */

import React from 'react';
import './index.scss';

/**
 * @param {Object} props
 * @param {Function} props.onResizeStart - リサイズ開始時のコールバック
 */
const ResizeHandle = ({ onResizeStart }) => {
  return (
    <div 
      className="resize-handle" 
      onMouseDown={(e) => onResizeStart(e)}
    />
  );
};

export default ResizeHandle;