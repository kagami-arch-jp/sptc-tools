/**
 * @file Keyboard Utils
 * @description キーボードイベントリスナーを抽象化するユーティリティ
 * @create 2026-04-18
 */

import { useEffect } from 'react';
import { getSelectionInfo } from '@/utils/textSelection';

/**
 * ライター用のキーボードショートカットを登録するフック
 * @param {React.RefObject} contentRef - テキストエリアのref
 * @param {Function} onQuery - クエリ実行関数 (txt, queryType, pos) => void
 */
export function useWriterKeyboardShortcuts(contentRef, onQuery) {
  useEffect(() => {
    const handler = e => {
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        const { selectedText, end } = getSelectionInfo(contentRef.current)
        const headTxt = selectedText || contentRef.current.value.substr(0, end)
        headTxt && onQuery(headTxt, 'after', [end, end])
      }
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        const { selectedText, start, end } = getSelectionInfo(contentRef.current)
        selectedText && onQuery(selectedText, 'rewrite', [start, end])
      }
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        const { selectedText, start, end } = getSelectionInfo(contentRef.current)
        selectedText && onQuery(selectedText, 'expand', [start, end])
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [contentRef, onQuery]);
}
