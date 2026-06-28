import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../components/TodoInput';

describe('TodoInput', () => {
  it('入力フィールドが表示される', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByPlaceholderText('新しいタスクを追加...')).toBeInTheDocument();
  });

  it('テキスト未入力のとき追加ボタンが無効', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: '追加' })).toBeDisabled();
  });

  it('テキストを入力すると追加ボタンが有効になる', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '牛乳を買う');

    expect(screen.getByRole('button', { name: '追加' })).toBeEnabled();
  });

  it('フォーム送信で onAdd が呼ばれてフィールドがクリアされる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを追加...');
    await user.type(input, '牛乳を買う');
    await user.click(screen.getByRole('button', { name: '追加' }));

    // onAdd が呼ばれたことを確認
    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledWith('牛乳を買う', 'medium', 'work', undefined);

    // 入力がクリアされたことを確認
    expect(input).toHaveValue('');
  });

  it('入力にフォーカスすると優先度・カテゴリの選択肢が表示される', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByPlaceholderText('新しいタスクを追加...'));

    expect(screen.getByText('優先度:')).toBeInTheDocument();
    expect(screen.getByText('カテゴリ:')).toBeInTheDocument();
  });

  it('優先度「高」を選んで追加すると high が渡される', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByPlaceholderText('新しいタスクを追加...'));
    await user.click(screen.getByRole('button', { name: '高' }));
    await user.type(screen.getByPlaceholderText('新しいタスクを追加...'), '重要タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(onAdd).toHaveBeenCalledWith('重要タスク', 'high', 'work', undefined);
  });
});
