import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GuessCharacterMode } from './GuessCharacterMode';
import { ATTRIBUTE_COLUMNS } from './characterAttributes';
import { charactersById } from '../../data/characters';
import { useGameSession } from '../../store/useGameSession';
import { useProgression } from '../../store/useProgression';

function renderMode() {
  return render(
    <MemoryRouter>
      <GuessCharacterMode />
    </MemoryRouter>,
  );
}

function findTargetCharacter() {
  const id = document.querySelector('[data-character-id]')?.getAttribute('data-character-id');
  const character = id ? charactersById.get(id) : undefined;
  if (!character) throw new Error('Could not identify the target character from data-character-id');
  return character;
}

async function guess(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.type(screen.getByRole('combobox'), name);
  await user.click(await screen.findByRole('option', { name }));
}

describe('GuessCharacterMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('shows no guess rows before the first guess', () => {
    renderMode();
    expect(screen.getByText(/your guesses will unfold here/i)).toBeInTheDocument();
  });

  it('renders a header for every trait column', () => {
    renderMode();
    for (const column of ATTRIBUTE_COLUMNS) {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    }
  });

  it('adds a comparison row after a wrong guess, without ending the round', async () => {
    const user = userEvent.setup();
    renderMode();
    const target = findTargetCharacter();
    const wrong = [...charactersById.values()].find((c) => c.id !== target.id)!;

    await guess(user, wrong.name);

    expect(screen.getByText(wrong.name)).toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeEnabled();
  });

  it('allows unlimited guesses until the correct character is found', async () => {
    const user = userEvent.setup();
    renderMode();
    const target = findTargetCharacter();
    const wrongCharacters = [...charactersById.values()].filter((c) => c.id !== target.id).slice(0, 3);

    for (const wrong of wrongCharacters) {
      await guess(user, wrong.name);
    }
    await guess(user, target.name);

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`solved in ${wrongCharacters.length + 1} guesses`, 'i'))).toBeInTheDocument();
  });

  it('records guessCount in the scoring context and reveals the answer', async () => {
    const user = userEvent.setup();
    renderMode();
    const target = findTargetCharacter();
    const wrong = [...charactersById.values()].find((c) => c.id !== target.id)!;

    await guess(user, wrong.name);
    await guess(user, target.name);

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(target.name, { selector: 'strong' })).toBeInTheDocument();
    expect(useGameSession.getState().lastResult?.attempt.context?.guessCount).toBe(2);
  });

  it('does not offer an already-guessed character again, and guessCount does not double-count it', async () => {
    const user = userEvent.setup();
    renderMode();
    const target = findTargetCharacter();
    const wrong = [...charactersById.values()].find((c) => c.id !== target.id)!;

    await guess(user, wrong.name);
    await user.type(screen.getByRole('combobox'), wrong.name);
    expect(screen.queryByRole('option', { name: wrong.name })).not.toBeInTheDocument();

    await user.clear(screen.getByRole('combobox'));
    await guess(user, target.name);

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(useGameSession.getState().lastResult?.attempt.context?.guessCount).toBe(2);
  });

  it('keeps the reveal-answer button disabled before 5 guesses', async () => {
    const user = userEvent.setup();
    renderMode();
    const target = findTargetCharacter();
    const wrongCharacters = [...charactersById.values()].filter((c) => c.id !== target.id).slice(0, 4);

    expect(screen.getByRole('button', { name: 'Reveal answer' })).toBeDisabled();

    for (const wrong of wrongCharacters) {
      await guess(user, wrong.name);
    }

    expect(screen.getByRole('button', { name: 'Reveal answer' })).toBeDisabled();
  });

  it('enables the reveal-answer button after 5 guesses and reveals the character as incorrect', async () => {
    const user = userEvent.setup();
    renderMode();
    const target = findTargetCharacter();
    const wrongCharacters = [...charactersById.values()].filter((c) => c.id !== target.id).slice(0, 5);

    for (const wrong of wrongCharacters) {
      await guess(user, wrong.name);
    }

    const revealButton = screen.getByRole('button', { name: 'Reveal answer' });
    expect(revealButton).toBeEnabled();
    await user.click(revealButton);

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
    expect(screen.getByText(target.name, { selector: 'strong' })).toBeInTheDocument();
    expect(useGameSession.getState().lastResult?.attempt.correct).toBe(false);
    expect(useGameSession.getState().score).toBe(0);
  });
});
