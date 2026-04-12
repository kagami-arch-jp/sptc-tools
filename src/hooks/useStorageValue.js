/**
 * useStorageValue Hook
 *
 * 機能リスト:
 * 1. localStorageを使用したデータの永続化
 * 2. react-cross-component-stateによるコンポーネント間での状態同期
 * 3. 指定したキーに基づいた動的な状態管理
 *
 * 作成日: 2026/04/12
 *
 * 呼び出し方:
 * const [value, setValue] = useStorageValue('my-storage-key', defaultValue);
 */
import { storageStore } from '@/store/storageStore';

export function getInitialValue(key, defaultValue) {
  try {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      return JSON.parse(savedValue);
    }
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
  }
  return defaultValue;
}

export function useStorageValue(key, defaultValue) {
  // 2. storageStoreからこのキーに対応する共有状態を取得または作成
  const sharedState = storageStore.getOrCreateState(key, getInitialValue(key, defaultValue));

  // 3. 状態の購読
  const [stateValue, setStateValue] = sharedState.use();

  // 4. 値の更新関数をラップしてlocalStorageへの書き込みを追加
  const setValue = (newValue) => {
    try {
      // グローバル状態の更新
      sharedState.setValue(newValue);

      // localStorageへの同期保存
      localStorage.setItem(key, JSON.stringify(sharedState.getValue()));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  };

  return [stateValue, setValue];
}
