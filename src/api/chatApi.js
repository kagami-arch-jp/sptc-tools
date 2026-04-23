/**
 * @file Chat API
 * @description チャットボットのメッセージ送信用API
 * @create 2026-04-18
 */

import { fetchStream } from '@/utils/fetch';
import {getCommonParams} from '@/store/settingStore'
import {chatSettingStore} from '@/store/chatStore'

export async function sendMessage(history, onData) {
  return fetchStream('/ollama/chat', {history, ...getCommonParams(false, chatSettingStore)}, onData)
}
export async function summaryMessage(history, onData) {
  return fetchStream('/ollama/chatSummary', {history, ...getCommonParams(false, chatSettingStore)}, onData)
}
export async function updateUserImage(history, onData) {
  return fetchStream('/ollama/chatUserImage', {history, ...getCommonParams(false, chatSettingStore)}, onData)
}
