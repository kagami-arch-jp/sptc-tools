import createSharedState from 'react-cross-component-state';

const STORAGE_KEY = 'app_settings';

const getDefaultSettings = () => ({
  onlineMode: true,
  apiKey: '',
  textModel: '',
  imageModel: '',
  temperature: 0,
  contextLength: 8,
});

const getInitialValue = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return { ...getDefaultSettings(), ...JSON.parse(saved) };
    } catch (e) {
      return getDefaultSettings();
    }
  }
  return getDefaultSettings();
};

const settingStore = createSharedState(getInitialValue());

// 监听状态变化并持久化
const originalSetValue = settingStore.setValue;
settingStore.setValue = (newValue) => {
  originalSetValue(newValue);
  const currentVal = settingStore.getValue();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentVal));
};
export default settingStore;
