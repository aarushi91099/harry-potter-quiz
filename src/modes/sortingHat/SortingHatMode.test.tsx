import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SortingHatMode } from './SortingHatMode';

const HOUSES = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];

describe('SortingHatMode', () => {
  it('walks through 5 questions and reveals a house at the end', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SortingHatMode />
      </MemoryRouter>,
    );

    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Question ${i + 1} of 5`)).toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
    }

    const heading = await screen.findByText('The Sorting Hat says...');
    expect(heading).toBeInTheDocument();

    const revealed = HOUSES.find((house) => screen.queryByText(house));
    expect(revealed).toBeDefined();

    expect(screen.getByRole('button', { name: 'Take the quiz again' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to mode select' })).toBeInTheDocument();
  });
});
