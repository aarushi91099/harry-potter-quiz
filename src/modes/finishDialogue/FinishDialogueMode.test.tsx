import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FinishDialogueMode } from './FinishDialogueMode';
import { dialogues } from '../../data/dialogues';
import { useProgression } from '../../store/useProgression';

function renderMode() {
  return render(
    <MemoryRouter>
      <FinishDialogueMode />
    </MemoryRouter>,
  );
}

function findRenderedDialogue() {
  const partial = document.querySelector('blockquote')?.textContent?.replace(/^"|"$/g, '') ?? '';
  const entry = dialogues.find((d) => d.partial === partial);
  if (!entry) throw new Error(`Could not find dialogue for partial: ${partial}`);
  return entry;
}

describe('FinishDialogueMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('accepts a case/punctuation-insensitive correct answer', async () => {
    const user = userEvent.setup();
    renderMode();

    const entry = findRenderedDialogue();
    await user.type(screen.getByLabelText('Your answer'), entry.answer.toUpperCase() + '.');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(`"${entry.fullDialogue}"`)).toBeInTheDocument();
  });

  it('rejects a wrong answer', async () => {
    const user = userEvent.setup();
    renderMode();

    findRenderedDialogue();
    await user.type(screen.getByLabelText('Your answer'), 'definitelywrongword');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
  });

  it('disables submit until the input has text', () => {
    renderMode();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});
