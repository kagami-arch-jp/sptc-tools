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
  }=settingStore.getValue()
  const [textModel, imageModel]=onlineMode?
    [textModelOnline, imageModelOnline]:
    [textModelLocal, imageModelLocal]
  return {
    apiKey: onlineMode && apiKey || '',
    model: isGenerateImage? imageModel: textModel,
    temperature,
    contextLength: contextLength * 1024,
  }
}
