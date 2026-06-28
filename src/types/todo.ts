export type Priority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | 'active' | 'completed';
export type Category = 'work' | 'personal' | 'shopping' | 'other';

export const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: 'work',     label: '仕事',   color: 'bg-blue-100 text-blue-700' },
  { value: 'personal', label: '個人',   color: 'bg-green-100 text-green-700' },
  { value: 'shopping', label: '買い物', color: 'bg-orange-100 text-orange-700' },
  { value: 'other',    label: 'その他', color: 'bg-gray-100 text-gray-600' },
];

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
  dueDate?: string;
}
