import { fetch } from '@/utils/fetch';

import settingStore from '@/store/settingStore';

function getApiKey() {
  const {onlineMode, apiKey}=settingStore.getValue() || {}
  return onlineMode && apiKey || ''
}

export async function fetchTextModels() {
  return await fetch('/ollama/listModels', {apiKey: getApiKey()});
}

export async function fetchImageModels() {
  return await fetch('/ollama/listModels', {apiKey: getApiKey()});
}
