import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementToastHost } from './AchievementToastHost';
import { useToastStore } from '../store/useToastStore';

const achievement = { id: 'quote-master', name: 'Quote Master', description: 'x', check: () => true };

describe('AchievementToastHost', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when there are no toasts', () => {
    render(<AchievementToastHost />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders a toast for each unlocked achievement', () => {
    useToastStore.getState().pushToasts([achievement, { ...achievement, id: 'creature-hunter', name: 'Creature Hunter' }]);
    render(<AchievementToastHost />);

    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByText('Quote Master')).toBeInTheDocument();
    expect(screen.getByText('Creature Hunter')).toBeInTheDocument();
  });

  it('dismisses a toast when its close button is clicked', async () => {
    const user = userEvent.setup();
    useToastStore.getState().pushToasts([achievement]);
    render(<AchievementToastHost />);

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('auto-dismisses after the timeout', () => {
    vi.useFakeTimers();
    useToastStore.getState().pushToasts([achievement]);
    render(<AchievementToastHost />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    vi.advanceTimersByTime(4000);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
