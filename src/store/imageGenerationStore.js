import {createStoreSharedState} from '@/store/storage';
import createSharedState from 'react-cross-component-state';

export const imageGenerationStore = createSharedState({
  progress: 0,
  imageUrl: null,
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
});

export const promptStore = createStoreSharedState('imageGenerationStore.prompt', '')
export const sizeStore = createStoreSharedState('imageGenerationStore.size', 256)
export const stepsStore = createStoreSharedState('imageGenerationStore.steps', 9)
