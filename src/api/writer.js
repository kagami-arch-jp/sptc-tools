import {fetchStream} from '@/utils/fetch'

import settingStore, {getCommonParams} from '@/store/settingStore';

export async function querySuggestion(param, onData) {
  await fetchStream('/ollama/writerSuggestion', {...param, ...getCommonParams()}, onData)
}
