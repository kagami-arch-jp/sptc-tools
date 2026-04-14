/**
 * テキストエリアで選択された文字列と開始・終了位置を取得
 * @param {HTMLTextAreaElement} textarea
 * @returns {{selectedText:string, start:number, end:number}}
 */
export function getSelectionInfo(textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.slice(start, end);
  return { selectedText, start, end };
}

/**
 * 指定範囲を新しい文字列で置換し、カーソル位置を置換後の文字列末尾にする
 * @param {HTMLTextAreaElement} textarea
 * @param {number} start
 * @param {number} end
 * @param {string} newText
 */
export function replaceRange(textarea, start, end, newText) {
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = before + newText + after;
  const pos = before.length + newText.length;
  textarea.setSelectionRange(before.length, pos);
}

/**
 * テキストエリアのカーソル位置を指定（start===end でキャレット移動）
 * @param {HTMLTextAreaElement} textarea
 * @param {number} pos
 */
export function setCursorPosition(textarea, pos) {
  textarea.setSelectionRange(pos, pos);
  textarea.focus();
}

export function removeDuplicateString(base, text, maxChar=50) {
  const bl=base.length
  for(let i=maxChar; i-->1; ) {
    if(base.substr(bl-i)===text.substr(0, i)) {
      return text.substr(i)
    }
  }
  return text
}
