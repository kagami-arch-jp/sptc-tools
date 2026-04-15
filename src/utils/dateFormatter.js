/**
 * 現在時刻をフォーマットして返す
 * @returns {string} YYYY/MM/DD HH:mm:ss
 */
export function formatNow() {
  const now = new Date();
  return now.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
  }).replace(/\//g, '/') + ' ' + 
     now.toLocaleTimeString('ja-JP', {
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit'
     });
}