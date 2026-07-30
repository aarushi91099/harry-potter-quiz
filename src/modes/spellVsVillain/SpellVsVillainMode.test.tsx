import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SpellVsVillainMode } from './SpellVsVillainMode';
import { spellScenarios } from '../../data/spellScenarios';
import { spellsById } from '../../data/spells';
import { useGameSession } from '../../store/useGameSession';
import { useProgression } from '../../store/useProgression';

function renderMode(difficulty: 'easy' | 'medium' | 'hard' = 'easy') {
  return render(
    <MemoryRouter>
      <SpellVsVillainMode difficulty={difficulty} />
    </MemoryRouter>,
  );
}

function findRenderedScenario() {
  const prompt = document.querySelector('.rounded-xl p')?.textContent ?? '';
  const scenario = spellScenarios.find((s) => s.prompt === prompt);
  if (!scenario) throw new Error(`Could not find scenario for prompt: ${prompt}`);
  return scenario;
}

describe('SpellVsVillainMode', () => {
  beforeEach(() => {
    useGameSession.getState().start('spellVsVillain', 'easy');
    useProgression.getState().reset();
  });

  it('shows the explanation and marks correct when the right spell is chosen', async () => {
    const user = userEvent.setup();
    renderMode();

    const scenario = findRenderedScenario();
    const correctSpellName = spellsById.get(scenario.correctSpellId)!.name;

    await user.click(screen.getByRole('button', { name: correctSpellName }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(scenario.explanation)).toBeInTheDocument();
    expect(useGameSession.getState().score).toBeGreaterThan(0);
  });

  it('marks incorrect when the wrong spell is chosen', async () => {
    const user = userEvent.setup();
    renderMode();

    const scenario = findRenderedScenario();
    const wrongSpellName = Object.values(Object.fromEntries(spellsById)).find(
      (s) => s.id !== scenario.correctSpellId,
    )!.name;

    await user.click(screen.getByRole('button', { name: wrongSpellName }));

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
    expect(useGameSession.getState().score).toBe(0);
  });

  it('advances to a new scenario on "Next scenario"', async () => {
    const user = userEvent.setup();
    renderMode();

    const scenario = findRenderedScenario();
    const correctSpellName = spellsById.get(scenario.correctSpellId)!.name;
    await user.click(screen.getByRole('button', { name: correctSpellName }));
    await screen.findByText('Correct!');

    await user.click(screen.getByRole('button', { name: 'Next scenario' }));

    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(useGameSession.getState().totalCount).toBe(1);
  });
});
