import React, { useEffect, useRef, useState } from 'react';
import dialogStore from '@/store/dialogStore';
import Spinner from '@/components/Spinner';
import './index.scss';

/**
 * @file DialogRenderer
 * @description 负责监听全局状态并渲染弹窗的渲染器。
 */
function DialogRenderer() {
  const [dialog, setDialog] = dialogStore.use();
  const timerRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

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

    if (dialog.type === 'prompt') {
      setInputValue(dialog.defaultValue || '');
    }

    return () => clearTimer();
  }, [dialog]);

  if (!dialog) return null;

  const handleAction = (actionType) => {
    try {
      if (actionType === 'confirm') {
        if (dialog.onConfirm) dialog.onConfirm(dialog.type === 'prompt' ? inputValue : undefined);
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
    if ((dialog.type === 'confirm' || dialog.type === 'prompt') && dialog.onCancel) {
      handleAction('cancel');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAction('confirm');
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

  if (dialog.type === 'prompt') {
    return (
      <div className="dialog-overlay" onClick={handleOverlayClick}>
        <div className="dialog-prompt" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-content">{dialog.message}</div>
          <input
            className="dialog-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
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

  if (dialog.type === 'loading') {
    return (
      <div className="dialog-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-loading">
          <Spinner msg={dialog.message || 'ネットワークに接続できません'} />
        </div>
      </div>
    );
  }

  return null;
}

export default DialogRenderer;
