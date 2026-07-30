import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterSearchSelect } from './CharacterSearchSelect';

describe('CharacterSearchSelect', () => {
  it('filters the full character catalog as the user types', async () => {
    const user = userEvent.setup();
    render(<CharacterSearchSelect onSelect={() => {}} />);

    const input = screen.getByRole('combobox');
    await user.type(input, 'sirius');

    // Debounced filtering means the dropdown briefly shows the unfiltered top results
    // (which happen to include both names) before settling — wait for both conditions
    // to hold together so the assertion reflects the settled, filtered state.
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /sirius black/i })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: /hermione granger/i })).not.toBeInTheDocument();
    });
  });

  it('calls onSelect with the full character record when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CharacterSearchSelect onSelect={onSelect} />);

    await user.type(screen.getByRole('combobox'), 'luna');
    await user.click(await screen.findByRole('option', { name: /luna lovegood/i }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ id: 'luna-lovegood', name: 'Luna Lovegood' });
  });

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CharacterSearchSelect onSelect={onSelect} />);

    await user.type(screen.getByRole('combobox'), 'malfoy');
    await screen.findByRole('option', { name: /draco malfoy/i });

    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].name).toBe('Lucius Malfoy');
  });

  it('matches by alias, not just primary name', async () => {
    const user = userEvent.setup();
    render(<CharacterSearchSelect onSelect={() => {}} />);

    await user.type(screen.getByRole('combobox'), 'you-know-who');

    expect(await screen.findByRole('option', { name: /lord voldemort/i })).toBeInTheDocument();
  });
});
