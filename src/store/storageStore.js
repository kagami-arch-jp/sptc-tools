import createSharedState from 'react-cross-component-state';

/**
 * storageStore
 * 存储所有持久化状态实例的映射表，确保同一个 key 在全局只有一个状态实例
 */
const statesMap = new Map();

export const storageStore = {
  /**
   * 获取或创建指定 key 的共享状态
   * @param {string} key 
   * @param {any} initialValue 
   */
  getOrCreateState: (key, initialValue) => {
    if (!statesMap.has(key)) {
      statesMap.set(key, createSharedState(initialValue));
    }
    return statesMap.get(key);
  }
};