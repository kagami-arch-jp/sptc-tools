/**
 * 背景色に基づいて、最適なテキスト色（白または黒）を返します。
 * @param {string} hexColor - 背景色の16進数文字列
 * @returns {string} 'black' | 'white'
 */
export function getContrastYIQ(hexColor) {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // YIQ equation
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

export const PRESET_COLORS = [
  '#FFD1DC', // Pink
  '#B2E2F2', // Blue
  '#C1E1C1', // Green
  '#FDFD96', // Yellow
  '#E6E6FA', // Lavender
  '#FFB347', // Orange
  '#D4F0F0', // Cyan
];