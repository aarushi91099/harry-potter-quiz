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

describe('BlurryCharacterMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('renders the mystery image with a non-zero blur filter initially', () => {
    renderMode();
    const img = screen.getByAltText('Mystery character');
    expect(img.style.filter).toMatch(/blur\(/);
  });

  it('marks correct and awards points for the right character', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();

    await user.type(screen.getByRole('combobox'), character.name);
    await user.click(await screen.findByRole('option', { name: character.name }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(useGameSession.getState().score).toBeGreaterThan(0);
    expect(useGameSession.getState().lastResult?.attempt.context?.earliness).toBeTypeOf('number');
  });

  it('marks incorrect for the wrong character', async () => {
    const user = userEvent.setup();
    renderMode();
    const character = findRenderedCharacter();
    const wrongName = [...charactersById.values()].find((c) => c.id !== character.id)!.name;

    await user.type(screen.getByRole('combobox'), wrongName);
    await user.click(await screen.findByRole('option', { name: wrongName }));

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
