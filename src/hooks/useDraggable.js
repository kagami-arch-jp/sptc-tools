import { useState, useEffect, useCallback } from 'react';

const supportTouch=window.ontouchstart!==undefined

function toEvent(e) {
  return e.touches?.[0] || e
}

/**
 * ドラッグ移動ロジックを管理するHook
 *
 * @param {Function} onDrag - ドラッグ中の位置更新コールバック
 * @param {Function} onDragEnd - ドラッグ終了時のコールバック
 * @returns {Function} ドラッグ開始関数
 */
export const useDraggable = (onDragStart, onDrag, onDragEnd) => {
  const startDrag = useCallback((e, initialPos) => {
    e=toEvent(e)
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e) => {
      e.stopPropagation()
      e=toEvent(e)
      onDrag(e.clientX-startX+initialPos.x, e.clientY-startY+initialPos.y);
    };

    const [move, end]=supportTouch? ['touchmove', 'touchend']: ['mousemove', 'mouseup']

    const handleMouseUp = () => {
      document.removeEventListener(move, handleMouseMove);
      document.removeEventListener(end, handleMouseUp);
      if (onDragEnd) onDragEnd();
    };

    document.addEventListener(move, handleMouseMove);
    document.addEventListener(end, handleMouseUp);
  }, [onDrag, onDragEnd]);

  const dragHandlers={
    [supportTouch? 'onTouchStart': 'onMouseDown']: e=>{
      e.stopPropagation()
      onDragStart(e)
    },
  }

  return { startDrag, dragHandlers };
};
