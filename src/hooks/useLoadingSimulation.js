/**
 * @file useLoadingSimulation.js
 * @description ボタンのローディング状態をシミュレートするためのカスタムフック
 * @author kagami-arch-j@bot
 * @created 2026-04-21
 */
import { useState, useCallback } from 'react';

/**
 * @function useLoadingSimulation
 * @param {number} duration - ローディング状態を維持する時間（ミリ秒）
 * @returns {[boolean, function]} [isLoading, startLoading]
 */
export function useLoadingSimulation(duration = 2000) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, duration);
  }, [duration]);

  return [isLoading, startLoading];
}