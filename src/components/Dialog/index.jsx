/**
 * @file Dialog Component
 * @description 命令式调用的弹窗组件，支持 Confirm 和 Toast 模式。
 * @version 1.0.0
 * @create 2026-04-16
 * @usage
 * Dialog.confirm({ message: '确定删除吗？', onConfirm: () => {}, onCancel: () => {} });
 * Dialog.toast({ message: '保存成功', duration: 2 });
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import DialogRenderer from './DialogRenderer'
import dialogStore from '@/store/dialogStore';
import './index.scss';

let dialogDom=null
function init() {
  if(!dialogDom) {
    dialogDom=document.createElement('div')
    document.body.appendChild(dialogDom)
    ReactDOM.createRoot(dialogDom).render(<DialogRenderer />)
  }
}

const Dialog = {
  /**
   * 确认框模式
   * @param {Object} options
   * @param {string} options.message - 提示内容
   * @param {Function} [options.onConfirm] - 确认回调
   * @param {Function} [options.onCancel] - 取消回调
   */
  confirm: ({ message, onConfirm, onCancel }) => {
    init()
    dialogStore.setValue({
      type: 'confirm',
      message,
      onConfirm,
      onCancel,
    });
  },

  /**
   * 提示框模式
   * @param {Object} options
   * @param {string} options.message - 提示内容
   * @param {number} [options.duration=2] - 持续时间（秒）
   */
  toast: (any) => {
    init()
    if(typeof any==='string') any={message: any, duration: 2}
    const {message, duration}=any
    dialogStore.setValue({
      type: 'toast',
      message,
      duration,
    });
  },

  /**
   * 关闭当前弹窗
   */
  close: () => {
    dialogStore.setValue(null);
  }
};

export default Dialog;
