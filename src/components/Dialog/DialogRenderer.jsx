import React, { useEffect, useRef } from 'react';
import dialogStore from '@/store/dialogStore';
import './index.scss';

/**
 * @file DialogRenderer
 * @description 负责监听全局状态并渲染弹窗的渲染器。
 */
function DialogRenderer() {
  const [dialog, setDialog] = dialogStore.use();
  const timerRef = useRef(null);

  // 清理定时器
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();
    if (!dialog) return;

    if (dialog.type === 'toast') {
      timerRef.current = setTimeout(() => {
        dialogStore.setValue(null);
      }, (dialog.duration || 3) * 1000);
    }

    return () => clearTimer();
  }, [dialog]);

  if (!dialog) return null;

  const handleAction = (actionType) => {
    try {
      if (actionType === 'confirm') {
        if (dialog.onConfirm) dialog.onConfirm();
      } else {
        if (dialog.onCancel) dialog.onCancel();
      }
    } catch (error) {
      console.error('Dialog callback error:', error);
    } finally {
      dialogStore.setValue(null);
    }
  };

  const handleOverlayClick = () => {
    if (dialog.type === 'confirm' && dialog.onCancel) {
      handleAction('cancel');
    }
  };

  if (dialog.type === 'confirm') {
    return (
      <div className="dialog-overlay" onClick={handleOverlayClick}>
        <div className="dialog-confirm" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-content">{dialog.message}</div>
          <div className="dialog-actions">
            <button className="btn-cancel" onClick={() => handleAction('cancel')}>
              キャンセル
            </button>
            <button className="btn-confirm" onClick={() => handleAction('confirm')}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (dialog.type === 'toast') {
    return (
      <div className="dialog-toast">
        <div className="toast-content">{dialog.message}</div>
      </div>
    );
  }

  return null;
}

export default DialogRenderer;
