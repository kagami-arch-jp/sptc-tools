import { createStoreSharedState } from '@/store/storage';

const stores = {};

export function getCommonSettingStore(settingKey) {
  if (!stores[settingKey]) {
    stores[settingKey] = createStoreSharedState(`common_settings.${settingKey}`, {});
  }
  return stores[settingKey];
}

export function getCommonSettingValue(settingKey, key) {
  const store = stores[settingKey];
  if (!store) return undefined;
  return store.getValue()?.[key];
}

export function useCommonSetting(settingKey, key) {
  const store = getCommonSettingStore(settingKey);
  const settings = store.useValue();
  const fullKey = key;
  return settings?.[fullKey];
}
