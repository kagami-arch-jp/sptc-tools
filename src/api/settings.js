import { fetch } from '@/utils/fetch';

import settingStore from '@/store/settingStore';

function getApiKey() {
  const {onlineMode, apiKey}=settingStore.getValue() || {}
  return onlineMode && apiKey || ''
}

export async function fetchModels() {
  return await fetch('/ollama/listModels', {apiKey: getApiKey()});
}
