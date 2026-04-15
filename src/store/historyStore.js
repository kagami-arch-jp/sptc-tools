import {createStoreSharedState} from '@/store/storage';

const caches={}

export function getHistoryListStoreByKey(key) {
  const historyStore = caches[key]?
    caches[key]:
    caches[key]=(createStoreSharedState('historyList.Data.'+key, []));

  /**
   * 履歴を追加する
   * @param {string} text - 追加するテキスト内容
   */
  const addHistory = (text) => {
    const newItem = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      content: text,
      isMarkdown: false,
    };
    historyStore.setValue((prev) => [newItem, ...prev]);
  };

  /**
   * 履歴を削除する
   * @param {string} id - 削除するアイテムのID
   */
  const deleteHistory = (id) => {
    historyStore.setValue((prev) => prev.filter((item) => item.id !== id));
  };

  // 拡張プロパティとしてメソッドを付与
  historyStore.addHistory = addHistory;
  historyStore.deleteHistory = deleteHistory;

  return historyStore
}
