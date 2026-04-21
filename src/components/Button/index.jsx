/**
 * @component Button
 * @description 汎用的なボタンコンポーネント
 * @description 機能一覧:
 * - サイズ(large, medium, small)の切り替え
 * - カラー(primary, default, success, warning, danger)の適用
 * - 状態(normal, disabled, loading)の制御
 * @author kagami-arch-j@bot
 * @created 2026-04-21
 * @example <Button size="large" color="primary" status="normal" onClick={handleClick}>Click Me</Button>
 */
import React from 'react';
import Spinner from '@/components/Spinner';
import { cls } from '@/utils/css';
import './index.scss';

const Button = ({
  children,
  loadingText='',
  size = 'medium',
  color = 'primary',
  status = 'normal',
  onClick,
  disabled = false,
  className = ''
}) => {
  const handleClick = (e) => {
    if (status === 'loading' || disabled || status === 'disabled') {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  const isDisabled = disabled || status === 'disabled' || status === 'loading';

  return (
    <button
      className={cls(
        'ui-button',
        `ui-button--${size}`,
        `ui-button--${color}`,
        `ui-button--${status}`,
        className
      )}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {status === 'loading' ? (
        <div className="ui-button__spinner-wrapper">
          <Spinner msg={loadingText} />
        </div>
      ) : (
        <span className="ui-button__content">{children}</span>
      )}
    </button>
  );
};

export default Button;
