import createSharedState from 'react-cross-component-state';

const initialState = {
  progress: 0,
  imageUrl: null,
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
};

const imageGenerationStore = createSharedState(initialState);

export default imageGenerationStore;