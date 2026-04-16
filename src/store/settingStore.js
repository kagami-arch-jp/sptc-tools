import {createStoreSharedState} from '@/store/storage';

const settingStore=createStoreSharedState('app_settings', {
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
  tone: false,
});

export default settingStore

export function getCommonParams(isGenerateImage=false) {
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
  }=settingStore.getValue()
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

export function isReady() {
  const c=settingStore.getValue()
  if(!c.textModelLocal && !c.textModelOnline) return false
  return true
}
