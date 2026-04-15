import {createStoreSharedState} from '@/utils/localStorage';

export const writerSessions = createStoreSharedState('writer_sessions', {
  sessions: [],
  selectedId: '',
});
