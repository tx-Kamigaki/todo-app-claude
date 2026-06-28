import './index.css';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import { TodoFooter } from './components/TodoFooter';

export default function App() {
  const {
    todos,
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
  } = useTodos();

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
          TODO
        </h1>
        <p className="text-violet-200 text-sm mt-1">タスクを管理しよう</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl todo-shadow p-6">
        <TodoInput onAdd={addTodo} />
        <FilterBar
          filter={filter}
          search={search}
          categoryFilter={categoryFilter}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryFilter}
        />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onUpdatePriority={updatePriority}
          onReorder={reorderTodos}
        />
        <TodoFooter
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      </div>

      <p className="text-center text-violet-200 text-xs mt-4 opacity-60">
        ダブルクリックで編集 · ドラッグで並び替え
      </p>
    </div>
  );
}
