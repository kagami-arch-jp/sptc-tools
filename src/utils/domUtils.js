export function getMouseDelta(moveEvent, startX, startY) {
  return {
    dx: moveEvent.x-startX,
    dy: moveEvent.y-startY,
  }
}

/**
 * 要素の現在の位置とサイズを取得する
 *
 * @param {HTMLElement} element - 対象要素
 * @returns {object} {left, top, width, height}
 */
export const getElementRect = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };
};
