/**
 * @file Chat API
 * @description チャットボットのメッセージ送信用API
 * @create 2026-04-18
 */

import { fetchStream } from '@/utils/fetch';
import { chatSettingStore } from '@/store/chatStore'
import { globalSettingStore, LANGUAGE_OPTIONS } from '@/store/globalSettingStore'

function getCommonParams() {
  const global=globalSettingStore.getValue()
  const chat=chatSettingStore.getValue()
  return {
    language: LANGUAGE_OPTIONS.find(x=>x.name===global.language)?.value,
    tone: chat.tone,
    apiKey: chat.useApiKey && chat.apiKey || '',
    model: chat.useApiKey ? chat.onlineModals: chat.localModals,
    temperature: parseFloat(chat.temperature),
    contextLength: parseInt(chat.contextLength),
  }
}

export async function sendMessage(history, onData, who) {
  return fetchStream('/ollama/chat', {history, who, ...getCommonParams()}, onData)
}
export async function summaryMessage(history, onData) {
  return fetchStream('/ollama/chatSummary', {history, ...getCommonParams()}, onData)
}
export async function updateUserImage(history, onData) {
  return fetchStream('/ollama/chatUserImage', {history, ...getCommonParams()}, onData)
}
