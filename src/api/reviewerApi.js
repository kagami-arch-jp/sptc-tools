import {fetchStream} from '@/utils/fetch'

import settingStore, {getCommonParams} from '@/store/settingStore';

export async function getAiResponse(param, onData) {
  await fetchStream('/ollama/answerTheContent', {...param, ...getCommonParams()}, onData)
}
