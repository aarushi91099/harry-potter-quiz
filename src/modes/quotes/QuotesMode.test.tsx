import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QuotesMode } from './QuotesMode';
import { quotes } from '../../data/quotes';
import { charactersById } from '../../data/characters';
import { useGameSession } from '../../store/useGameSession';
import { useProgression } from '../../store/useProgression';

function renderMode() {
  return render(
    <MemoryRouter>
      <QuotesMode />
    </MemoryRouter>,
  );
}

function findRenderedQuote() {
  const text = document.querySelector('blockquote')?.textContent?.replace(/^"|"$/g, '') ?? '';
  const quote = quotes.find((q) => q.text === text);
  if (!quote) throw new Error(`Could not identify rendered quote: ${text}`);
  return quote;
}

async function guessWrong(user: ReturnType<typeof userEvent.setup>, correctCharacterId: string) {
  const wrongName = [...charactersById.values()].find((c) => c.id !== correctCharacterId)!.name;
  await user.clear(screen.getByRole('combobox'));
  await user.type(screen.getByRole('combobox'), wrongName);
  await user.click(await screen.findByRole('option', { name: wrongName }));
}

describe('QuotesMode', () => {
  beforeEach(() => {
    useProgression.getState().reset();
  });

  it('has no difficulty picker — renders straight into a question', () => {
    renderMode();
    expect(screen.queryByText('Choose a difficulty')).not.toBeInTheDocument();
    expect(document.querySelector('blockquote')).toBeInTheDocument();
  });

  it('marks correct on the first try with no clues shown', async () => {
    const user = userEvent.setup();
    renderMode();
    const quote = findRenderedQuote();
    const correctName = charactersById.get(quote.characterId)!.name;

    await user.type(screen.getByRole('combobox'), correctName);
    await user.click(await screen.findByRole('option', { name: correctName }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(useGameSession.getState().score).toBeGreaterThan(0);
  });

  it('reveals one clue per wrong guess, up to 2, then reveals the answer on a 3rd wrong guess', async () => {
    const user = userEvent.setup();
    renderMode();
    const quote = findRenderedQuote();

    await guessWrong(user, quote.characterId);
    expect(await screen.findByText(/^Gender:/)).toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();

    await guessWrong(user, quote.characterId);
    const clueLines = document.querySelectorAll('ul li');
    expect(clueLines.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();

    await guessWrong(user, quote.characterId);
    expect(await screen.findByText('Not quite.')).toBeInTheDocument();
    const correctName = charactersById.get(quote.characterId)!.name;
    expect(screen.getByText(correctName)).toBeInTheDocument();
  });

  it('still marks correct if guessed right after seeing a clue', async () => {
    const user = userEvent.setup();
    renderMode();
    const quote = findRenderedQuote();
    const correctName = charactersById.get(quote.characterId)!.name;

    await guessWrong(user, quote.characterId);
    await user.clear(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), correctName);
    await user.click(await screen.findByRole('option', { name: correctName }));

    expect(await screen.findByText('Correct!')).toBeInTheDocument();
  });

  it('resets clues and loads a new quote on "Next quote"', async () => {
    const user = userEvent.setup();
    renderMode();
    const quote = findRenderedQuote();
    const correctName = charactersById.get(quote.characterId)!.name;

    await user.type(screen.getByRole('combobox'), correctName);
    await user.click(await screen.findByRole('option', { name: correctName }));
    await screen.findByText('Correct!');

    await user.click(screen.getByRole('button', { name: 'Next quote' }));

    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(useGameSession.getState().totalCount).toBe(1);
  });
});
