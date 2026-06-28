import { useState } from 'react';
import type { Todo, Priority } from '../types/todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onReorder: (from: number, to: number) => void;
}

export function TodoList({ todos, onToggle, onDelete, onEdit, onUpdatePriority, onReorder }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3 opacity-40">
          <rect x="8" y="8" width="32" height="38" rx="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 20H32M16 27H28M16 34H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-sm">タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo, i) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={i}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onUpdatePriority={onUpdatePriority}
          isDragOver={overIndex === i && dragIndex !== i}
          onDragStart={idx => { setDragIndex(idx); setOverIndex(idx); }}
          onDragOver={idx => setOverIndex(idx)}
          onDragEnd={() => {
            if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
              onReorder(dragIndex, overIndex);
            }
            setDragIndex(null);
            setOverIndex(null);
          }}
        />
      ))}
    </div>
  );
}
