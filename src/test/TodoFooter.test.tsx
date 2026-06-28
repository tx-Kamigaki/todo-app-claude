import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFooter } from '../components/TodoFooter';

describe('TodoFooter', () => {
  it('タスクが0件のときは何も表示されない', () => {
    const { container } = render(
      <TodoFooter activeCount={0} completedCount={0} onClearCompleted={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('未完了件数が表示される', () => {
    render(
      <TodoFooter activeCount={3} completedCount={0} onClearCompleted={vi.fn()} />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/件未完了/)).toBeInTheDocument();
  });

  it('完了済みがないとき「完了済みを削除」ボタンは表示されない', () => {
    render(
      <TodoFooter activeCount={2} completedCount={0} onClearCompleted={vi.fn()} />
    );
    expect(screen.queryByRole('button', { name: '完了済みを削除' })).not.toBeInTheDocument();
  });

  it('完了済みがあるとき「完了済みを削除」ボタンが表示される', () => {
    render(
      <TodoFooter activeCount={1} completedCount={2} onClearCompleted={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: '完了済みを削除' })).toBeInTheDocument();
  });

  it('「完了済みを削除」ボタンを押すと onClearCompleted が呼ばれる', async () => {
    const user = userEvent.setup();
    const onClearCompleted = vi.fn();
    render(
      <TodoFooter activeCount={1} completedCount={2} onClearCompleted={onClearCompleted} />
    );

    await user.click(screen.getByRole('button', { name: '完了済みを削除' }));

    expect(onClearCompleted).toHaveBeenCalledOnce();
  });
});
