import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GuessCharacterMode } from './GuessCharacterMode';
import { buildCharacterClues } from './buildCharacterClues';
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

function renderedClueLines(): string[] {
  return [...document.querySelectorAll('ul li')].map((li) => li.textContent ?? '');
}

async function revealAllClues(user: ReturnType<typeof userEvent.setup>) {
  while (screen.queryByRole('button', { name: 'Reveal next clue' })) {
    await user.click(screen.getByRole('button', { name: 'Reveal next clue' }));
  }
}

function findRenderedCharacter() {
  // Read the true rendered character id from a data attribute rather than reverse-matching
  // clue text, since larger catalogs can produce characters with overlapping clue values.
  const id = document.querySelector('ul')?.getAttribute('data-character-id');
  const character = id ? charactersById.get(id) : undefined;
  if (!character) throw new Error('Could not identify rendered character from data-character-id');
  return character;
}

describe('GuessCharacterMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('starts with exactly one clue visible', () => {
    renderMode();
    expect(renderedClueLines()).toHaveLength(1);
    expect(renderedClueLines()[0]).toMatch(/^Gender:/);
  });

  it('reveals one additional clue per click', async () => {
    const user = userEvent.setup();
    renderMode();
    const before = renderedClueLines().length;
    await user.click(screen.getByRole('button', { name: 'Reveal next clue' }));
    expect(renderedClueLines().length).toBe(before + 1);
  });

  it('marks correct and records cluesRevealed in scoring context', async () => {
    const user = userEvent.setup();
    renderMode();
    await revealAllClues(user);
    const cluesShown = renderedClueLines().length;
    const character = findRenderedCharacter();

    await user.type(screen.getByRole('combobox'), character.name);
    await user.click(await screen.findByRole('option', { name: character.name }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(useGameSession.getState().lastResult?.attempt.context?.cluesRevealed).toBe(cluesShown);
  });

  it('marks incorrect when the wrong character is chosen', async () => {
    const user = userEvent.setup();
    renderMode();
    await revealAllClues(user);
    const character = findRenderedCharacter();
    const wrongName = [...charactersById.values()].find((c) => c.id !== character.id)!.name;

    await user.type(screen.getByRole('combobox'), wrongName);
    await user.click(await screen.findByRole('option', { name: wrongName }));

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
  });

  it('reveals every clue in the feedback banner after answering', async () => {
    const user = userEvent.setup();
    renderMode();
    await revealAllClues(user);
    const character = findRenderedCharacter();

    await user.type(screen.getByRole('combobox'), character.name);
    await user.click(await screen.findByRole('option', { name: character.name }));
    await screen.findByText('Correct!');

    const fullClueCount = buildCharacterClues(character).length;
    expect(within(document.querySelector('ul')!).getAllByRole('listitem')).toHaveLength(fullClueCount);
  });
});
