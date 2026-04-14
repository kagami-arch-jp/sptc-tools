import { useCallback } from 'react';
import { getMouseDelta } from '@/utils/domUtils';

/**
 * リサイズロジックを管理するHook
 * 
 * @param {Function} onResize - リサイズ中のサイズ更新コールバック
 * @returns {Function} リサイズ開始関数
 */
export const useResizable = (onResize) => {
  const startResize = useCallback((e, initialSize) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = initialSize.width;
    const startHeight = initialSize.height;

    const handleMouseMove = (moveEvent) => {
      const { dx, dy } = getMouseDelta(moveEvent, startX, startY);
      onResize(startWidth + dx, startHeight + dy);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize]);

  return { startResize };
};