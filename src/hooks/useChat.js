/**
 * @file useChat Hook
 * @description メッセージ送信、ローディング、エラーハンドリングのロジック
 * @create 2026-04-18
 */

import { useState, useCallback } from 'react';
import chatStore from '@/store/chatStore';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async (content) => {

    setIsLoading(true);
    setError(null);

    try {
      await chatStore.sendMessage(content)
    } catch (e) {
      console.error('Chat Error:', e);
      setError(e.message || '通信エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { send, isLoading, error, resetError: () => setError(null) };
}
