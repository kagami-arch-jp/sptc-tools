/**
 * @file useTimer.js
 * @description 2秒間の遅延実行およびキャンセルロジックを管理するカスタムフック。
 * @author kagcor-arch-jp@bot
 * @create 2026-04-17
 */

import { useState, useRef, useCallback } from 'react';

/**
 * @param {Function} onConfirm - 確定時に実行する関数
 * @param {number} delay - 遅延時間（ミリ秒）
 * @returns {[boolean, Function, Function]} [isPending, startTimer, cancelTimer]
 */
export function useTimer(onConfirm, delay = 2000) {
  const [isPending, setIsPending] = useState(false);
  const timerRef = useRef(null);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPending(false);
  }, []);

  const startTimer = useCallback(() => {
    setIsPending(true);
    timerRef.current = setTimeout(() => {
      onConfirm();
      setIsPending(false);
      timerRef.current = null;
    }, delay);
  }, [onConfirm, delay]);

  // コンポーネントアンマウント時にクリーンアップ
  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { isPending, startTimer, cancelTimer, cleanup };
}