/**
 * @file SizeObserver.jsx
 * @description 指定された子要素のサイズ（幅・高さ）の変化を検知し、コールバックを通じて通知するコンポーエント。
 * @author kagami-arch-jp@bot
 * @created 2026-04-17
 * @usage
 * <SizeObserver onChangeSize={(size) => console.log(size)}>
 *   <div style={{ width: '100%' }}>監視対象</div>
 * </SizeObserver>
 * @features
 * - ResizeObserverを使用した要素サイズの監視
 * - マウント時の初期サイズ通知
 * - アンマウント時のメモリリーク防止（ResizeObserverの破棄）
 * - 非DOM要素やnullへの安全な対応
 */

import React, { useEffect, useRef } from 'react';
import {cls} from '@/utils/css'
/**
 * @typedef {Object} SizeInfo
 * @property {number} width - 要素の現在の幅
 * @property {number} height - 要素の現在の高さ
 */

/**
 * @param {Object} props
 * @param {Function} props.onChangeSize - サイズが変更された際に呼び出されるコールバック関数。引数としてSizeInfoを受け取る。
 * @param {React.ReactNode} props.children - 監視対象となる要素。
 */
const SizeObserver = ({ className, onChangeSize, getClassName, children }) => {
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const [sizeClassName, setSizeClassName]=React.useState('')

  useEffect(() => {
    // 子要素が存在しない、または監視可能なDOM要素でない場合は何もしない
    if (!containerRef.current || !children) {
      return;
    }

    // ResizeObserverの初期化
    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // ResizeObserver loop limit exceeded エラーを回避するため、
        // ブラウザの描画タイミングに依存しないよう、requestAnimationFrameを使用
        window.requestAnimationFrame(() => {
          const { width, height } = entry.contentRect;
          onChangeSize?.({ width, height });
          setSizeClassName(getClassName?.({width, height}))
        });
      }
    });

    // 監視の開始
    try {
      observerRef.current.observe(containerRef.current);
    } catch (error) {
      console.error('SizeObserver: Failed to observe element', error);
    }

    // クリーンアップ処理
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [children, onChangeSize]);

  return (
    <div ref={containerRef} className={cls(className, sizeClassName)}>
      {children}
    </div>
  );
};

export default SizeObserver;
