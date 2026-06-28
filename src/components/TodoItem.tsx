import { useState, useRef, useEffect } from 'react';
import type { Todo, Priority } from '../types/todo';

interface Props {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragOver: boolean;
}

const PRIORITY_COLORS: Record<Priority, { bg: string; border: string; dot: string; label: string }> = {
  low:    { bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-400',   label: '低' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-400', label: '中' },
  high:   { bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-400',    label: '高' },
};

function formatDueDate(dateStr: string): { text: string; overdue: boolean } {
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const overdue = diff < 0;
  if (diff === 0) return { text: '今日', overdue: false };
  if (diff === 1) return { text: '明日', overdue: false };
  if (diff === -1) return { text: '昨日', overdue: true };
  if (overdue) return { text: `${Math.abs(diff)}日超過`, overdue: true };
  return { text: `${diff}日後`, overdue: false };
}

export function TodoItem({ todo, index, onToggle, onDelete, onEdit, onUpdatePriority, onDragStart, onDragOver, onDragEnd, isDragOver }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);
  const p = PRIORITY_COLORS[todo.priority];

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    if (editText.trim()) onEdit(todo.id, editText);
    else setEditText(todo.text);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setEditText(todo.text); setEditing(false); }
  };

  const priorities: Priority[] = ['low', 'medium', 'high'];

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => { e.preventDefault(); onDragOver(index); }}
      onDragEnd={onDragEnd}
      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all animate-slide-in cursor-default select-none ${
        isDragOver ? 'drag-over' : `${p.bg} ${p.border}`
      } ${todo.completed ? 'opacity-60' : ''}`}
    >
      {/* Drag handle */}
      <div className="mt-0.5 text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="5" cy="3.5" r="1.2"/><circle cx="9" cy="3.5" r="1.2"/>
          <circle cx="5" cy="7" r="1.2"/><circle cx="9" cy="7" r="1.2"/>
          <circle cx="5" cy="10.5" r="1.2"/><circle cx="9" cy="10.5" r="1.2"/>
        </svg>
      </div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-violet-500 border-violet-500'
            : 'border-gray-300 hover:border-violet-400'
        }`}
      >
        {todo.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={editRef}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-gray-700 bg-white border border-violet-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            className={`text-sm leading-relaxed break-words ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
          >
            {todo.text}
          </span>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {/* Priority badge */}
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(v => !v)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${p.dot}`} />
              {p.label}
            </button>
            {showPriorityMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 min-w-[80px] animate-fade-in">
                {priorities.map(pr => {
                  const pc = PRIORITY_COLORS[pr];
                  return (
                    <button
                      key={pr}
                      onClick={() => { onUpdatePriority(todo.id, pr); setShowPriorityMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${pc.dot}`} />
                      {pc.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Due date */}
          {todo.dueDate && (() => {
            const { text, overdue } = formatDueDate(todo.dueDate);
            return (
              <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                {overdue ? '!' : ''} {text}
              </span>
            );
          })()}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-all"
          title="編集"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M9.5 1.5L11.5 3.5L4 11H2V9L9.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="削除"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 3.5H11M4.5 3.5V2.5H8.5V3.5M5 6V10M8 6V10M3 3.5L3.5 10.5H9.5L10 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
