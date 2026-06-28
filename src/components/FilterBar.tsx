import type { FilterStatus, Category } from '../types/todo';
import { CATEGORIES } from '../types/todo';

interface Props {
  filter: FilterStatus;
  search: string;
  categoryFilter: Category | 'all';
  onFilterChange: (f: FilterStatus) => void;
  onSearchChange: (s: string) => void;
  onCategoryChange: (c: Category | 'all') => void;
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了' },
];

export function FilterBar({ filter, search, categoryFilter, onFilterChange, onSearchChange, onCategoryChange }: Props) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent text-sm text-gray-600 placeholder-gray-400 bg-white"
        />
        {search && (
          <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === f.value
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            categoryFilter === 'all'
              ? 'bg-violet-100 border-violet-400 text-violet-700'
              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          全カテゴリ
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              categoryFilter === cat.value
                ? 'bg-violet-100 border-violet-400 text-violet-700'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
