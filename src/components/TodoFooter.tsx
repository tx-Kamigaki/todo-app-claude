interface Props {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function TodoFooter({ activeCount, completedCount, onClearCompleted }: Props) {
  const total = activeCount + completedCount;
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
      <span>
        <span className="font-semibold text-violet-600">{activeCount}</span> 件未完了
        {completedCount > 0 && (
          <span className="ml-2 text-gray-400">/ {total} 件中</span>
        )}
      </span>
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-gray-400 hover:text-red-500 transition-colors font-medium"
        >
          完了済みを削除
        </button>
      )}
    </div>
  );
}
