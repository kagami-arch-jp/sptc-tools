import {createStoreSharedState} from '@/utils/localStorage';

const initialState = {
  items: [],
  playingId: null,
  currentEdit: null,
};

const readerStore = createStoreSharedState('Reader.store', initialState);

/**
 * @function addItem
 * @param {object} item - { id, title, content }
 */
readerStore.addItem = (item) => {
  readerStore.setValue((prev) => ({
    ...prev,
    items: [item, ...prev.items],
  }));
};

/**
 * @function updateItem
 * @param {string} id
 * @param {object} updatedData
 */
readerStore.updateItem = (id, updatedData) => {
  if(!readerStore.getValue().items.find(x=>x.id===id)) {
    readerStore.addItem(updatedData)
    return
  }
  readerStore.setValue((prev) => ({
    ...prev,
    items: prev.items.map((item) => (item.id === id ? { ...item, ...updatedData } : item)),
  }));
};

/**
 * @function deleteItem
 * @param {string} id
 */
readerStore.deleteItem = (id) => {
  readerStore.setValue((prev) => ({
    ...prev,
    items: prev.items.filter((item) => item.id !== id),
    playingId: prev.playingId === id ? null : prev.playingId,
  }));
};

/**
 * @function setPlayingId
 * @param {string|null} id
 */
readerStore.setPlayingId = (id) => {
  readerStore.setValue((prev) => ({
    ...prev,
    playingId: id,
  }));
};

export default readerStore;
