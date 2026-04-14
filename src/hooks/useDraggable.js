import { useState, useEffect, useCallback } from 'react';

/**
 * ドラッグ移動ロジックを管理するHook
 *
 * @param {Function} onDrag - ドラッグ中の位置更新コールバック
 * @param {Function} onDragEnd - ドラッグ終了時のコールバック
 * @returns {Function} ドラッグ開始関数
 */
export const useDraggable = (onDrag, onDragEnd) => {
  const startDrag = useCallback((e, initialPos) => {
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e) => {
      onDrag(e.clientX-startX+initialPos.x, e.clientY-startY+initialPos.y);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (onDragEnd) onDragEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onDrag, onDragEnd]);

  return { startDrag };
};
