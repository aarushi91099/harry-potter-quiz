import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GuessHouseMode } from './GuessHouseMode';
import { houseScenarios } from '../../data/houseScenarios';
import { useProgression } from '../../store/useProgression';

const HOUSES = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'] as const;

function renderMode() {
  return render(
    <MemoryRouter>
      <GuessHouseMode />
    </MemoryRouter>,
  );
}

function findRenderedScenario() {
  const prompt = document.querySelector('.rounded-xl')?.textContent ?? '';
  const scenario = houseScenarios.find((s) => s.prompt === prompt);
  if (!scenario) throw new Error(`Could not find scenario for prompt: ${prompt}`);
  return scenario;
}

describe('GuessHouseMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('shows reasoning and marks correct when the right house is chosen', async () => {
    const user = userEvent.setup();
    renderMode();

    const scenario = findRenderedScenario();
    await user.click(screen.getByRole('button', { name: scenario.correctHouse }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText(scenario.reasoning)).toBeInTheDocument();
  });

  it('marks incorrect when the wrong house is chosen', async () => {
    const user = userEvent.setup();
    renderMode();

    const scenario = findRenderedScenario();
    const wrongHouse = HOUSES.find((h) => h !== scenario.correctHouse)!;
    await user.click(screen.getByRole('button', { name: wrongHouse }));

    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
  });
});
