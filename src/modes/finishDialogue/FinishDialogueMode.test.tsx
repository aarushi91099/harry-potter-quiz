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

async function guessWrong(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByLabelText('Your answer'), text);
  await user.click(screen.getByRole('button', { name: 'Submit' }));
}

describe('FinishDialogueMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('accepts a case/punctuation-insensitive correct answer on the first guess', async () => {
    const user = userEvent.setup();
    renderMode();

    const entry = findRenderedDialogue();
    await guessWrong(user, entry.answer.toUpperCase() + '.');

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(`"${entry.fullDialogue}"`)).toBeInTheDocument();
  });

  it('reveals one more letter after each wrong guess instead of ending the round immediately', async () => {
    const user = userEvent.setup();
    renderMode();
    const entry = findRenderedDialogue();

    await guessWrong(user, 'definitelywrongword');

    expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();
    expect(screen.getByText('definitelywrongword')).toBeInTheDocument();
    const firstLetter = entry.answer[0];
    const hiddenLetters = entry.answer
      .slice(1)
      .split('')
      .map((ch) => (ch === ' ' ? ' ' : '_'))
      .join(' ');
    expect(screen.getByText(`${firstLetter} ${hiddenLetters}`)).toBeInTheDocument();
    expect(screen.getByText('Guess 2 of 3')).toBeInTheDocument();
  });

  it('marks incorrect and reveals the full line after three wrong guesses', async () => {
    const user = userEvent.setup();
    renderMode();
    const entry = findRenderedDialogue();

    await guessWrong(user, 'wrongone');
    await guessWrong(user, 'wrongtwo');
    await guessWrong(user, 'wrongthree');

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
    expect(screen.getByText(`"${entry.fullDialogue}"`)).toBeInTheDocument();
  });

  it('accepts a correct answer on a later guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const entry = findRenderedDialogue();

    await guessWrong(user, 'wrongone');
    await guessWrong(user, entry.answer);

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
  });

  it('disables submit until the input has text', () => {
    renderMode();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});
