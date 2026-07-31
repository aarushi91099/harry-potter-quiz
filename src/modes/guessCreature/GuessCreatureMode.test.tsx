import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GuessCreatureMode } from './GuessCreatureMode';
import { creaturesById } from '../../data/creatures';
import { useGameSession } from '../../store/useGameSession';
import { useProgression } from '../../store/useProgression';

function renderMode() {
  return render(
    <MemoryRouter>
      <GuessCreatureMode />
    </MemoryRouter>,
  );
}

function findRenderedCreature() {
  // Read the true rendered creature id from a data attribute (present regardless of reveal stage)
  // rather than reverse-matching the generated placeholder avatar, since several creature names
  // are single words and can share the same initials (e.g. "Boggart" / "Basilisk" -> "B").
  const id = document.querySelector('[data-creature-id]')?.getAttribute('data-creature-id');
  const creature = id ? creaturesById.get(id) : undefined;
  if (!creature) throw new Error('Could not identify rendered creature from data-creature-id');
  return creature;
}

async function guessWrong(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.type(screen.getByRole('combobox'), name);
  await user.click(await screen.findByRole('option', { name }));
}

describe('GuessCreatureMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('defaults to the black silhouette image', () => {
    renderMode();
    const creature = findRenderedCreature();
    const img = screen.getByAltText('Mystery creature');
    expect(img.getAttribute('src')).toBe(`/creature-images/black_silhouette/${creature.id}.png`);
  });

  it('shows a red wrong-guess entry and switches to the white-background silhouette after one wrong guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const creature = findRenderedCreature();
    const wrongName = [...creaturesById.values()].find((c) => c.id !== creature.id)!.name;

    await guessWrong(user, wrongName);

    expect(screen.getByText(wrongName)).toBeInTheDocument();
    expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();
    const img = screen.getByAltText('Mystery creature');
    expect(img.getAttribute('src')).toBe(`/creature-images/silhouette/${creature.id}.png`);
  });

  it('reveals the coloured image and marks incorrect after two wrong guesses', async () => {
    const user = userEvent.setup();
    renderMode();
    const creature = findRenderedCreature();
    const wrongOptions = [...creaturesById.values()].filter((c) => c.id !== creature.id);

    await guessWrong(user, wrongOptions[0].name);
    await guessWrong(user, wrongOptions[1].name);

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
    const img = screen.getByAltText('Mystery creature');
    expect(img.getAttribute('src')).toBe(`/creature-images/creatures/${creature.id}.png`);
  });

  it('marks correct and awards points for the right creature on the first guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const creature = findRenderedCreature();

    await guessWrong(user, creature.name);

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(creature.description)).toBeInTheDocument();
    expect(useGameSession.getState().score).toBeGreaterThan(0);
    const img = screen.getByAltText('Mystery creature');
    expect(img.getAttribute('src')).toBe(`/creature-images/creatures/${creature.id}.png`);
  });

  it('marks correct on the second guess after one wrong guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const creature = findRenderedCreature();
    const wrongName = [...creaturesById.values()].find((c) => c.id !== creature.id)!.name;

    await guessWrong(user, wrongName);
    await guessWrong(user, creature.name);

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(useGameSession.getState().score).toBeGreaterThan(0);
  });
});
