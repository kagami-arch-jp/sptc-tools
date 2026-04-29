import { createStoreSharedState } from './storage';

const DEFAULT_TOOL_ORDER = [2, 3, 5, 7];

const toolStore = createStoreSharedState('tool-btns', {
  toolOrder: DEFAULT_TOOL_ORDER,
})

export const reorderTools = (newOrder) => {
  toolStore.setValue({toolOrder: newOrder})
}

export default toolStore
