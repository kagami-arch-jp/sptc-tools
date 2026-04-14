import createSharedState from 'react-cross-component-state';

const zIndexStore = createSharedState({
  maxZ: 100,
  activeIds: []
});

/**
 * ウィンドウの重なり順を管理するストア
 * 
 * @property {number} maxZ - 現在の最大Z-Index
 * @property {Array<string>} activeIds - 重なり順（最後が最前面）を保持するIDリスト
 */
const updateZIndex = (id) => {
  zIndexStore.setValue(prev => {
    const newActiveIds = prev.activeIds.filter(activeId => activeId !== id);
    newActiveIds.push(id);
    return {
      ...prev,
      activeIds: newActiveIds,
      maxZ: prev.maxZ + 1
    };
  });
};

const bringToFront = (id) => {
  updateZIndex(id);
};

export { zIndexStore, bringToFront };