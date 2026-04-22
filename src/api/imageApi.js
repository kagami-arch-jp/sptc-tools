import { fetchStream } from '@/utils/fetch';

import settingStore, {getCommonParams} from '@/store/settingStore';

/**
 * 画像生成をシミュレートするジェネレーター関数
 * @param {object} params - 生成パラメータ (prompt, size, steps)
 * @yields {number} 現在の進捗率 (0-100)
 * @returns {Promise<string>} 生成された画像のURL
 */
export async function generateImage(params, onProgress) {
  await fetchStream('/ollama/generateImage', {
    ...params,
    ...getCommonParams(true)
  }, p=>{
    onProgress(p.progress, p.image)
  })
}
