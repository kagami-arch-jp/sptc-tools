import {createStoreSharedState} from '@/store/storage';

const getInitialValue=()=>({
  onlineMode: true,
  apiKey: '',
  textModelLocal: '',
  imageModelLocal: '',
  textModelOnline: '',
  imageModelOnline: '',
  localModels: [],
  onlineModels: [],
  temperature: 0,
  contextLength: 8,
  language: '日本語',
  tone: 'assistant',
  fontSizeMode: 'regular',
})

export const languageMap = {
  '日本語': 'ja-JP',
  'English': 'en-US',
  '中文': 'zh-CN',
};

const settingStore=createStoreSharedState('app_settings', getInitialValue());

export default settingStore

export function getCommonParams(isGenerateImage=false, store=settingStore) {
  const {
    onlineMode,
    apiKey,
    textModelLocal,
    imageModelLocal,
    textModelOnline,
    imageModelOnline,
    temperature,
    contextLength,
    language,
    tone,
  }=store.getValue()
  const [textModel, imageModel]=onlineMode?
    [textModelOnline, imageModelOnline]:
    [textModelLocal, imageModelLocal]
  return {
    apiKey: onlineMode && apiKey || '',
    model: isGenerateImage? imageModel: textModel,
    temperature,
    contextLength: contextLength * 1024,
    language,
    tone,
  }
}

export function isReady(store=settingStore) {
  const c=store.getValue()
  if(!c.textModelLocal && !c.textModelOnline) return false
  return true
}

const stores={}
export function getSubSettingStore(settingKey) {
  stores[settingKey]=stores[settingKey] || createStoreSharedState('app_settings.'+settingKey, getInitialValue())
  return stores[settingKey]
}
