import { useState, useRef } from 'react';
import type { Priority, Category } from '../types/todo';
import { CATEGORIES } from '../types/todo';

interface Props {
  onAdd: (text: string, priority: Priority, category: Category, dueDate?: string) => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low',    label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high',   label: '高' },
];

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, category, dueDate || undefined);
    setText('');
    setDueDate('');
    setPriority('medium');
    setCategory('work');
    setShowOptions(false);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="新しいタスクを追加..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-gray-700 placeholder-gray-400 bg-white shadow-sm text-sm"
          onFocus={() => setShowOptions(true)}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-5 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors shadow-sm text-sm whitespace-nowrap"
        >
          追加
        </button>
      </div>

      {showOptions && (
        <div className="mt-3 flex flex-wrap gap-3 items-center animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">優先度:</span>
            <div className="flex gap-1">
              {PRIORITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    priority === opt.value
                      ? 'bg-violet-100 border-violet-400 text-violet-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">カテゴリ:</span>
            <div className="flex gap-1">
              {CATEGORIES.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategory(opt.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    category === opt.value
                      ? 'bg-violet-100 border-violet-400 text-violet-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">期日:</span>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="px-2 py-1 rounded-lg border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
            />
          </div>
        </div>
      )}
    </form>
  );
}
