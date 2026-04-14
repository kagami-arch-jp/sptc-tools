import {fetchStream} from '@/utils/fetch'

import settingStore from '@/store/settingStore';

function getCommonParams() {
  const {
    onlineMode,
    apiKey,
    textModel,
    imageModel,
    temperature,
    contextLength,
  }=settingStore.getValue()
  return {
    apiKey: onlineMode && apiKey || '',
    model: textModel,
    temperature,
    contextLength: contextLength * 1024,
  }
}

export async function querySuggestion(param, onData) {
  await fetchStream('/ollama/writerSuggestion', {...param, ...getCommonParams()}, onData)
}
