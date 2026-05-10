import { fetchStream } from '@/utils/fetch';


import { imageGenerationSettingStore } from '@/store/imageGenerationStore'
import { globalSettingStore } from '@/store/globalSettingStore'

function getCommonParams() {
  const image=imageGenerationSettingStore.getValue()
  return {
    apiKey: image.useApiKey && image.apiKey || '',
    model: image.useApiKey ? image.onlineModals: image.localModals,
  }
}

/**
 * 画像生成をシミュレートするジェネレーター関数
 * @param {object} params - 生成パラメータ (prompt, size, steps)
 * @yields {number} 現在の進捗率 (0-100)
 * @returns {Promise<string>} 生成された画像のURL
 */
export async function generateImage(params, onProgress) {
  await fetchStream({ action: '/ollama/generateImage', data: {
    ...params,
    ...getCommonParams()
  }, onData: p=>{
    onProgress(p.progress, p.image)
  } })
}
