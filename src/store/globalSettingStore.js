import { createStoreSharedState } from '@/store/storage';

export const globalSettingStore = createStoreSharedState('global_settings', {
  language: 'zh-CN',
  fontSize: 'medium',
  darkMode: false,
});

export const LANGUAGE_OPTIONS = [
  { name: 'zh-CN', value: '中文' },
  { name: 'ja-JP', value: '日本語' },
  { name: 'en', value: 'English' },
];

export const FONT_SIZE_OPTIONS = [
  { name: 'large', value: '大' },
  { name: 'medium', value: '中' },
  { name: 'small', value: '小' },
];

export function getFontSizePx(size) {
  const map = { large: 20, medium: 16, small: 14 };
  return map[size] || 20;
}

export function useGlobalSetting(key) {
  return globalSettingStore.useValue()?.[key];
}

export function useDarkMode() {
  return useGlobalSetting('darkMode')
}

export function useFontSize() {
  return getFontSizePx(useGlobalSetting('fontSize'))
}
