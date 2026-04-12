export function sleep(t) {
  return new Promise(r=>setTimeout(r, t))
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('コピーしました！');
  } catch (e) {
    alert('コピーに失敗しました');
  }
};
