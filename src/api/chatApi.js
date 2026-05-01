/**
 * @file Chat API
 * @description チャットボットのメッセージ送信用API
 * @create 2026-04-18
 */

import { fetch, fetchStream } from '@/utils/fetch';
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

export async function reset() {
  return fetch('/ollama/reset')
}
export async function sendMessage(history, onData, who, abortHandler) {
  return fetchStream('/ollama/chat', {history, who, ...getCommonParams()}, onData, abortHandler)
}
export async function summaryMessage(history, onData) {
  return fetchStream('/ollama/chatSummary', {history, ...getCommonParams()}, onData)
}
export async function updateUserImage(history, isMerge) {
  const {newProfile}=await fetchStream('/ollama/chatUserImage', {history, isMerge, ...getCommonParams()}, ({content: txt, err}, ctx)=>{
    ctx.newProfile=ctx.newProfile || ''
    ctx.newProfile+=txt || ''
  })
  return newProfile.match(/<UserImage>\s*([\s\S]+?)\s*<\/UserImage>|$/)[1] || null
}
