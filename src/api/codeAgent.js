import { fetch, fetchStream } from '@/utils/fetch';

import settingStore from '@/store/settingStore';

function getCommonParams(isGenerateImage=false) {
  const {
    onlineMode,
    apiKey,
    textModel,
    imageModel,
    temperature,
    contextLength,
  }=settingStore.getValue()
  return {
    apiKey: onlineMode && apiKey || '',
    model: isGenerateImage? imageModel: textModel,
    temperature,
    contextLength: contextLength * 1024,
  }
}

export async function analyzeRequirement(requirement, onData) {
  return await fetchStream('/ollama/generateAnalysis', { requirement, ...getCommonParams() }, onData);
}

export async function generateCode(requirement, onData) {
  return await fetchStream('/ollama/generateCode', { requirement, ...getCommonParams() }, onData);
}

export async function writeToFile(codeFiles) {
  return await fetch('/ollama/writeToFile', { codeFiles });
}

export async function getWorkdir() {
  return await fetch('/ollama/getWorkdir');
}
