/**
 * @description フォントサイズ選択コンポーネント。
 * @created 2026-04-17
 * @usage <FontSizeSelect />
 * @author kagami-arch-jp@bot
 *
 * 機能リスト:
 * - フォントサイズ（Regular/Large）の選択
 * - 選択状態の反映（settingStoreの更新）
 * - 選択変更時のhtml要素のfont-size動的変更
 */
import React from 'react';
import './index.scss';
import settingStore from '@/store/settingStore';
import { getElementRect } from '@/utils/domUtils';
import InlineStyle from '@/components/InlineStyle'

const FONT_SIZE_MODES = [
  { id: 'regular', label: '標準 (Regular)', size: '16px' },
  { id: 'large', label: '大 (Large)', size: '18px' }
];

function FontSizeSelect() {
  const [settings, setSettings] = settingStore.use();

  const handleChange = (e) => {
    const newMode = e.target.value;
    const newSize = FONT_SIZE_MODES.find(m => m.id === newMode)?.size || '16px';

    // Storeの更新
    setSettings({ ...settings, fontSizeMode: newMode });

    // DOMへの即時反映
    document.documentElement.style.fontSize = newSize;
  };

  return <>
    <InlineStyle css={
      `html, body{
        font-size: ${settings.fontSizeMode === 'large'? 18: 16}px;
      }`
    } />
    <div className="font-size-select">
      <label>フォントサイズ</label>
      <select
        value={settings.fontSizeMode}
        onChange={handleChange}
        className="font-size-select-input"
      >
        {FONT_SIZE_MODES.map(mode => (
          <option key={mode.id} value={mode.id}>
            {mode.label}
          </option>
        ))}
      </select>
    </div>
  </>
}

export default FontSizeSelect;
