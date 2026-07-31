import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { BlurryCharacterMode } from './BlurryCharacterMode';
import { charactersById } from '../../data/characters';
import { useGameSession } from '../../store/useGameSession';
import { useProgression } from '../../store/useProgression';

function renderMode() {
  return render(
    <MemoryRouter>
      <BlurryCharacterMode />
    </MemoryRouter>,
  );
}

function findRenderedCharacter() {
  // Read the true rendered character id from a data attribute rather than reverse-matching the
  // generated placeholder avatar image, since two different characters can share the same
  // initials+color combination (e.g. "Ginny Weasley" / "George Weasley" both -> "GW").
  const id = screen.getByAltText('Mystery character').getAttribute('data-character-id');
  const character = id ? charactersById.get(id) : undefined;
  if (!character) throw new Error('Could not identify rendered character from data-character-id');
  return character;
}

function pickWrongCharacter(excludeId: string) {
  return [...charactersById.values()].find((c) => c.id !== excludeId)!;
}

async function guessWrong(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.clear(screen.getByRole('combobox'));
  await user.type(screen.getByRole('combobox'), name);
  await user.click(await screen.findByRole('option', { name }));
}

describe('BlurryCharacterMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('renders the mystery image fully blurred initially', () => {
    renderMode();
    const img = screen.getByAltText('Mystery character');
    expect(img.style.filter).toBe('blur(24px)');
    expect(screen.getByText('Guess 1 of 10')).toBeInTheDocument();
  });

  it('marks correct and awards points for the right character', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();

    await user.type(screen.getByRole('combobox'), character.name);
    await user.click(await screen.findByRole('option', { name: character.name }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(useGameSession.getState().score).toBeGreaterThan(0);
    expect(useGameSession.getState().lastResult?.attempt.context?.earliness).toBe(1);
  });

  it('a wrong guess keeps the round going, clears blur a step, and lists the wrong guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();
    const wrongCharacter = pickWrongCharacter(character.id);

    await guessWrong(user, wrongCharacter.name);

    expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();
    expect(screen.getByText('Guess 2 of 10')).toBeInTheDocument();
    expect(screen.getByAltText('Mystery character').style.filter).toBe('blur(21.6px)');
    expect(screen.getByText(wrongCharacter.name)).toBeInTheDocument();
  });

  it('reveals the "known for" hint after the 3rd wrong guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();
    const wrongCharacter = pickWrongCharacter(character.id);

    expect(character.knownFor).toBeTruthy();

    for (let i = 0; i < 3; i++) {
      await guessWrong(user, wrongCharacter.name);
    }

    expect(screen.getByText('Known for:')).toBeInTheDocument();
    expect(screen.getByText(character.knownFor!)).toBeInTheDocument();
  });

  it('reveals the "first appeared in" hint after the 7th wrong guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();
    const wrongCharacter = pickWrongCharacter(character.id);

    expect(character.firstAppearance).toBeTruthy();

    for (let i = 0; i < 7; i++) {
      await guessWrong(user, wrongCharacter.name);
    }

    expect(screen.getByText('First appeared in:')).toBeInTheDocument();
    expect(screen.getByText(character.firstAppearance!)).toBeInTheDocument();
  });

  it('ends the round as incorrect after 10 wrong guesses', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();
    const wrongCharacter = pickWrongCharacter(character.id);

    for (let i = 0; i < 10; i++) {
      await guessWrong(user, wrongCharacter.name);
    }

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
    expect(useGameSession.getState().score).toBe(0);
  });

  it('removes the blur once feedback is shown', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();

    await user.type(screen.getByRole('combobox'), character.name);
    await user.click(await screen.findByRole('option', { name: character.name }));
    await screen.findByText('Correct!');

    expect(screen.getByAltText('Mystery character').style.filter).toBe('blur(0px)');
  });
});
