import createSharedState from 'react-cross-component-state';

/**
 * @description 全局弹窗状态管理
 * @property {string} type - 弹窗类型: 'confirm' | 'toast' | 'prompt'
 * @property {string} message - 提示文本
 * @property {string} defaultValue - Prompt 默认值
 * @property {number} duration - Toast 持续时间 (秒)
 * @property {function} onConfirm - 确认回调
 * @property {function} onCancel - 取消回调
 */
const dialogStore = createSharedState({
  type: null,
  message: '',
  defaultValue: '',
  duration: 3,
  onConfirm: null,
  onCancel: null,
});

export default dialogStore;