import {createStoreSharedState} from '@/utils/localStorage';

const initialSession = {
  id: Date.now().toString(),
  title: new Date().toLocaleString('ja-JP'),
  documentContent: '',
  chatHistory: [] // { id, question, answer, isLoading, isError }
};

const sessionStore = createStoreSharedState('Reviewer.sessions', {
  sessions: [initialSession],
  currentSessionId: initialSession.id
});

// 拡張機能として、storeに直接ロジックを持たせることはできないため、
// 外部から操作するためのユーティリティを定義します。
// ただし、今回は要件に基づき、storeの値を更新する関数を別途用意します。

export default sessionStore;
