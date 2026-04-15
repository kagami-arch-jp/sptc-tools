import {createStoreSharedState} from '@/utils/localStorage';

const initialState = {
  todos: [],
};

const todoStore = createStoreSharedState('todoList.data', initialState);

/**
 * @typedef {Object} TodoItem
 * @property {string} id - 一意のID
 * @param {string} text - タスク内容
 * @param {string} color - 背景色
 * @param {boolean} completed - 完了状態
 */

export const addTodo = (text, color) => {
  todoStore.setValue(prev => ({
    ...prev,
    todos: [
      { id: Date.now().toString(), text, color, completed: false },
      ...prev.todos
    ]
  }));
};

export const toggleTodo = (id) => {
  todoStore.setValue(prev => ({
    ...prev,
    todos: prev.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  }));
};

export const updateTodo = (id, text) => {
  todoStore.setValue(prev => ({
    ...prev,
    todos: prev.todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    )
  }));
};

export const deleteTodo = (id) => {
  todoStore.setValue(prev => ({
    ...prev,
    todos: prev.todos.filter(todo => todo.id !== id)
  }));
};

export const reorderTodos = (activeId, overId) => {
  todoStore.setValue(prev => {
    const newTodos = Array.from(prev.todos);
    const activeIndex = newTodos.findIndex(t => t.id === activeId);
    const overIndex = newTodos.findIndex(t => t.id === overId);

    if (activeIndex === -1 || overIndex === -1) return prev;

    const [removed] = newTodos.splice(activeIndex, 1);
    newASarray.splice(overIndex, 0, removed);

    return { ...prev, todos: newTodos };
  });
};

// Note: Reorder logic fix for implementation
export const moveTodo = (activeId, overId) => {
  todoStore.setValue(prev => {
    const oldIndex = prev.todos.findIndex(t => t.id === activeId);
    const newIndex = prev.todos.findIndex(t => t.id === overId);
    if (oldIndex === -1 || newIndex === -1) return prev;

    const newTodos = [...prev.todos];
    const [movedItem] = newTodos.splice(oldIndex, 1);
    newTodos.splice(newIndex, 0, movedItem);
    return { ...prev, todos: newTodos };
  });
};

export default todoStore;
