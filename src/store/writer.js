import {createStoreSharedState} from '@/store/storage';

export const writerSessions = createStoreSharedState('writer_sessions', {
  sessions: [],
  selectedId: '',
});
