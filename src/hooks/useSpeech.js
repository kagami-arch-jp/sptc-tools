import { useCallback, useRef, useEffect } from 'react';
import readerStore from '@/store/readerStore';

/**
 * @description Web Speech APIを使用した読み上げロジックのカスタムフック
 */
export function useSpeech() {
  const synth = window.speechSynthesis;
  const timeoutRef = useRef(null);

  const stopSpeech = useCallback(() => {
    synth.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    readerStore.setPlayingId(null);
  }, [synth]);

  const speak = useCallback((item) => {
    if (!item) return;

    if(readerStore.getValue().playingId) {
      stopSpeech()
      setTimeout(_=>speak(item), 300)
      return
    }

    readerStore.setPlayingId(item.id);

    const utterTitle = new SpeechSynthesisUtterance(item.title);
    utterTitle.lang = 'ja-JP';

    const utterContent = new SpeechSynthesisUtterance(item.content);
    utterContent.lang = 'ja-JP';

    // タイトルの終了イベント
    utterTitle.onend = () => {
      // 1秒待機
      timeoutRef.current = setTimeout(() => {
        synth.speak(utterContent);
      }, 1000);
    };

    // 本文の終了イベント（ループ再生）
    utterContent.onend = () => {
      // ループ再生のため、少し遅延させて再度開始
      timeoutRef.current = setTimeout(() => {
        if (readerStore.getValue().playingId === item.id) {
          synth.speak(utterTitle);
        }
      }, 2000);
    };

    // エラーハンドリング
    utterTitle.onerror = () => stopSpeech();
    utterContent.onerror = () => stopSpeech();

    synth.speak(utterTitle);
  }, [synth, stopSpeech]);

  useEffect(() => {
    return () => {
      synth.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [synth]);

  return { speak, stopSpeech };
}
