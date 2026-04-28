/**
 * @file Writer API
 * @description ライターの提案生成用API
 * @create 2026-04-18
 */

import { fetchStream } from '@/utils/fetch';
import { writerSettingStore } from '@/store/writerStore'
import { globalSettingStore, LANGUAGE_OPTIONS } from '@/store/globalSettingStore'

function getCommonParams() {
  const global=globalSettingStore.getValue()
  const writer=writerSettingStore.getValue()
  return {
    language: LANGUAGE_OPTIONS.find(x=>x.name===global.language)?.value,
    apiKey: writer.useApiKey && writer.apiKey || '',
    model: writer.useApiKey ? writer.onlineModals: writer.localModals,
    temperature: parseFloat(writer.temperature),
    contextLength: parseInt(writer.contextLength),
  }
}

export async function querySuggestion(param, onData) {
  await fetchStream('/ollama/writerSuggestion', {...param, ...getCommonParams()}, onData)
}
