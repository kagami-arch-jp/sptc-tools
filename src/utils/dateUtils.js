/**
 * @file dateUtils.js
 * @description 日付操作に関するユーティリティ関数。
 * @author kagami-arch-jp@
 * @create 2026-04-17
 */

/**
 * 指定された期間内に日付が含まれているか判定する
 * @param {Date} target - 判定対象の日付
 * @param {Date|null} start - 開始日
 * @param {Date|null} end - 終了日
 * @returns {boolean}
 */
export function isWithinRange(target, start, end) {
  if (!start || !end) return true;
  const t = new Date(target).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime()+86400e3;
  return t >= s && t <= e;
}

/**
 * 日付を YYYY/MM/DD 形式の文字列に変換する
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
