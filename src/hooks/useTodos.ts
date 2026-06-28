import { useState, useEffect, useCallback } from 'react';
import type { Todo, Priority, Category, FilterStatus } from '../types/todo';

const STORAGE_KEY = 'todos-v1';

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: Todo[] = JSON.parse(raw);
    // マイグレーション: 古いデータにcategoryがなければ'other'を補完
    return parsed.map(t => ({ ...t, category: t.category ?? ('other' as Category) }));
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback((text: string, priority: Priority, category: Category, dueDate?: string) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      priority,
      category,
      createdAt: Date.now(),
      dueDate: dueDate || undefined,
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    if (!text.trim()) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: text.trim() } : t));
  }, []);

  const updatePriority = useCallback((id: string, priority: Priority) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const reorderTodos = useCallback((fromIndex: number, toIndex: number) => {
    setTodos(prev => {
      const filtered = getFilteredTodos(prev, filter, search, categoryFilter);
      const item = filtered[fromIndex];
      const newFiltered = [...filtered];
      newFiltered.splice(fromIndex, 1);
      newFiltered.splice(toIndex, 0, item);
      const ids = new Set(filtered.map(t => t.id));
      const rest = prev.filter(t => !ids.has(t.id));
      return [...newFiltered, ...rest];
    });
  }, [filter, search, categoryFilter]);

  const filteredTodos = getFilteredTodos(todos, filter, search, categoryFilter);
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    search,
    categoryFilter,
    activeCount,
    completedCount,
    setFilter,
    setSearch,
    setCategoryFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    updatePriority,
    clearCompleted,
    reorderTodos,
  };
}

function getFilteredTodos(todos: Todo[], filter: FilterStatus, search: string, categoryFilter: Category | 'all'): Todo[] {
  return todos.filter(t => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !t.completed) ||
      (filter === 'completed' && t.completed);
    const matchesSearch = !search || t.text.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesFilter && matchesSearch && matchesCategory;
  });
}
