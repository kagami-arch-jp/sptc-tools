import {createStoreSharedState} from '@/store/storage';
import {getHistoryListStoreByKey} from '@/store/historyStore'

export const codeAgentInputText = createStoreSharedState('codeAgent.store.inputtext', '')
export const codeAgentResult = createStoreSharedState('codeAgent.store.result', '')
export const codeAgentCopyFiles = createStoreSharedState('codeAgent.store.codeFiles', null)
export const historyKey='codeAgent'
export const historyStore=getHistoryListStoreByKey(historyKey)
