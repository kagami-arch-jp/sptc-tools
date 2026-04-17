import { fetch } from '@/utils/fetch';

export async function fetchModels(apiKey) {
  return await fetch('/ollama/listModels', {apiKey});
}
