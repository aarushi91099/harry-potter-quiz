import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GuessCreatureMode } from './GuessCreatureMode';
import { creaturesById } from '../../data/creatures';
import { useGameSession } from '../../store/useGameSession';
import { useProgression } from '../../store/useProgression';

function renderMode(difficulty: 'easy' | 'medium' | 'hard' = 'easy') {
  return render(
    <MemoryRouter>
      <GuessCreatureMode difficulty={difficulty} />
    </MemoryRouter>,
  );
}

function findRenderedCreature() {
  // Read the true rendered creature id from a data attribute (present regardless of sub-mode)
  // rather than reverse-matching the generated placeholder avatar, since several creature names
  // are single words and can share the same initials (e.g. "Boggart" / "Basilisk" -> "B").
  const id = document.querySelector('[data-creature-id]')?.getAttribute('data-creature-id');
  const creature = id ? creaturesById.get(id) : undefined;
  if (!creature) throw new Error('Could not identify rendered creature from data-creature-id');
  return creature;
}

describe('GuessCreatureMode', () => {
  beforeEach(() => {
    useGameSession.getState().start('guessCreature', 'easy');
    useProgression.getState().reset();
  });

  it('defaults to Silhouette sub-mode with a brightness(0) filter', () => {
    renderMode();
    const img = screen.getByAltText('Mystery creature');
    expect(img.style.filter).toBe('brightness(0)');
  });

  it('switches to Blurry sub-mode and applies a blur filter', async () => {
    const user = userEvent.setup();
    renderMode();
    await user.click(screen.getByRole('button', { name: 'Blurry' }));
    expect(screen.getByAltText('Mystery creature').style.filter).toMatch(/blur\(/);
  });

  it('switches to Sound sub-mode and shows a play button instead of an image', async () => {
    const user = userEvent.setup();
    renderMode();
    await user.click(screen.getByRole('button', { name: 'Sound' }));
    expect(screen.getByRole('button', { name: 'Play creature sound' })).toBeInTheDocument();
    expect(screen.queryByAltText('Mystery creature')).not.toBeInTheDocument();
  });

  it('marks correct and awards points for the right creature', async () => {
    const user = userEvent.setup();
    renderMode();
    const creature = findRenderedCreature();

    await user.type(screen.getByRole('combobox'), creature.name);
    await user.click(await screen.findByRole('option', { name: creature.name }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(creature.description)).toBeInTheDocument();
    expect(useGameSession.getState().score).toBeGreaterThan(0);
  });

  it('marks incorrect for the wrong creature', async () => {
    const user = userEvent.setup();
    renderMode();
    const creature = findRenderedCreature();
    const wrongName = [...creaturesById.values()].find((c) => c.id !== creature.id)!.name;

    await user.type(screen.getByRole('combobox'), wrongName);
    await user.click(await screen.findByRole('option', { name: wrongName }));

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
  });

  it('does not throw when playing the sound button repeatedly', async () => {
    const user = userEvent.setup();
    renderMode();
    await user.click(screen.getByRole('button', { name: 'Sound' }));
    const playButton = screen.getByRole('button', { name: 'Play creature sound' });
    await expect(user.click(playButton)).resolves.not.toThrow();
    await expect(user.click(playButton)).resolves.not.toThrow();
  });
});
