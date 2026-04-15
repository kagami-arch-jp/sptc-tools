import {createStoreSharedState} from '@/store/storage';

export default createStoreSharedState('app_settings', {
  onlineMode: true,
  apiKey: '',
  textModel: '',
  imageModel: '',
  temperature: 0,
  contextLength: 8,
});
