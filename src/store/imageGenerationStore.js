import {createStoreSharedState} from '@/store/storage';

export const imageGenerationStore = createStoreSharedState('imageGenerationStore.main', {
  progress: 0,
  imageUrl: null,
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
});

export const promptStore = createStoreSharedState('imageGenerationStore.prompt', '')
export const sizeStore = createStoreSharedState('imageGenerationStore.size', 256)
export const stepsStore = createStoreSharedState('imageGenerationStore.steps', 9)
