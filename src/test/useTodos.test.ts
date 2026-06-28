import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';

// localStorageはブラウザ機能なのでテスト用にリセットする
beforeEach(() => {
  localStorage.clear();
});

describe('useTodos - タスク追加', () => {
  it('テキストを指定してタスクを追加できる', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('牛乳を買う', 'medium', 'shopping');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('牛乳を買う');
    expect(result.current.todos[0].priority).toBe('medium');
    expect(result.current.todos[0].category).toBe('shopping');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('空文字のタスクは追加されない', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('   ', 'low', 'other');
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('追加したタスクは先頭に来る', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('最初のタスク', 'low', 'work');
      result.current.addTodo('2番目のタスク', 'high', 'personal');
    });

    expect(result.current.todos[0].text).toBe('2番目のタスク');
    expect(result.current.todos[1].text).toBe('最初のタスク');
  });
});

describe('useTodos - 完了/未完了の切り替え', () => {
  it('タスクを完了状態にできる', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('テストタスク', 'medium', 'work');
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  it('完了状態のタスクを未完了に戻せる', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('テストタスク', 'medium', 'work');
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(id);
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });
});

describe('useTodos - 削除', () => {
  it('タスクを削除できる', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('削除するタスク', 'low', 'other');
      result.current.addTodo('残すタスク', 'low', 'other');
    });

    // 新しい順に並ぶので todos[0]='残すタスク', todos[1]='削除するタスク'
    const idToDelete = result.current.todos.find(t => t.text === '削除するタスク')!.id;

    act(() => {
      result.current.deleteTodo(idToDelete);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('残すタスク');
  });
});

describe('useTodos - フィルター', () => {
  it('未完了フィルターで完了済みタスクが非表示になる', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('未完了タスク', 'low', 'work');
      result.current.addTodo('完了タスク', 'low', 'work');
    });

    const completedId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(completedId);
      result.current.setFilter('active');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('未完了タスク');
  });

  it('カテゴリフィルターで絞り込める', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('仕事タスク', 'medium', 'work');
      result.current.addTodo('買い物タスク', 'medium', 'shopping');
    });

    act(() => {
      result.current.setCategoryFilter('work');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('仕事タスク');
  });
});

describe('useTodos - カウント', () => {
  it('activeCount が未完了の件数を返す', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('タスク1', 'low', 'work');
      result.current.addTodo('タスク2', 'low', 'work');
      result.current.addTodo('タスク3', 'low', 'work');
    });

    const id = result.current.todos[0].id;
    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.activeCount).toBe(2);
    expect(result.current.completedCount).toBe(1);
  });
});

describe('useTodos - 完了済み一括削除', () => {
  it('完了済みタスクをまとめて削除できる', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('残すタスク', 'low', 'work');
      result.current.addTodo('完了タスクA', 'low', 'work');
      result.current.addTodo('完了タスクB', 'low', 'work');
    });

    act(() => {
      result.current.toggleTodo(result.current.todos[0].id);
      result.current.toggleTodo(result.current.todos[1].id);
    });

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.allTodos).toHaveLength(1);
    expect(result.current.allTodos[0].text).toBe('残すタスク');
  });
});

describe('useTodos - localStorageへの保存', () => {
  it('タスクがlocalStorageに保存される', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('保存テスト', 'high', 'personal');
    });

    const saved = JSON.parse(localStorage.getItem('todos-v1') ?? '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0].text).toBe('保存テスト');
  });

  it('ページ再読み込みを模擬してもデータが復元される', () => {
    const { result: first } = renderHook(() => useTodos());

    act(() => {
      first.current.addTodo('永続化テスト', 'medium', 'work');
    });

    // 別インスタンスで再マウント（ページリロードと同じ状況）
    const { result: second } = renderHook(() => useTodos());
    expect(second.current.todos[0].text).toBe('永続化テスト');
  });
});
