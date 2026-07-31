import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sortingHatQuestions } from '../../data/sortingHatQuestions';
import type { SortingOption } from '../../data/types';
import { shuffle } from '../../lib/random';
import type { HouseName } from '../../engine/types';

const HOUSES: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
const QUESTION_COUNT = 5;

const HOUSE_COLOR: Record<HouseName, string> = {
  Gryffindor: '#e0263f',
  Ravenclaw: '#3b5bdb',
  Hufflepuff: '#ecc94b',
  Slytherin: '#2f9e56',
};

const HOUSE_BLURB: Record<HouseName, string> = {
  Gryffindor: 'You lead with courage. You\'d rather act boldly and risk being wrong than hold back.',
  Ravenclaw: 'You lead with curiosity. Understanding something deeply matters more to you than almost anything else.',
  Hufflepuff: 'You lead with loyalty. The people around you can always count on you to show up.',
  Slytherin: 'You lead with ambition. You know what you want, and you find a way to get there.',
};

function emptyTally(): Record<HouseName, number> {
  return { Gryffindor: 0, Ravenclaw: 0, Hufflepuff: 0, Slytherin: 0 };
}

function pickQuestions() {
  return shuffle(sortingHatQuestions).slice(0, QUESTION_COUNT);
}

function winningHouse(tally: Record<HouseName, number>): HouseName {
  const max = Math.max(...HOUSES.map((h) => tally[h]));
  const tied = HOUSES.filter((h) => tally[h] === max);
  return shuffle(tied)[0];
}

export function SortingHatMode() {
  const [questions, setQuestions] = useState(() => pickQuestions());
  const [step, setStep] = useState(0);
  const [tally, setTally] = useState(() => emptyTally());
  const [result, setResult] = useState<HouseName | null>(null);

  const currentQuestion = useMemo(() => questions[step], [questions, step]);

  function handleSelect(option: SortingOption) {
    const nextTally = { ...tally, [option.house]: tally[option.house] + 1 };
    if (step + 1 >= questions.length) {
      setResult(winningHouse(nextTally));
    } else {
      setTally(nextTally);
      setStep(step + 1);
    }
  }

  function handleRestart() {
    setQuestions(pickQuestions());
    setStep(0);
    setTally(emptyTally());
    setResult(null);
  }

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <div
          className="animate-pop-in rounded-xl border p-6 text-center"
          style={{ borderColor: HOUSE_COLOR[result], backgroundColor: `${HOUSE_COLOR[result]}1a` }}
        >
          <p className="text-sm text-[var(--text-secondary)]">The Sorting Hat says...</p>
          <p className="font-magical mt-1 text-4xl font-bold" style={{ color: HOUSE_COLOR[result] }}>
            {result}
          </p>
          <p className="mt-4 text-[var(--text-primary)]">{HOUSE_BLURB[result]}</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="hp-button rounded-lg bg-[var(--house-primary)] px-4 py-2 font-medium text-[#05060d]"
          >
            Take the quiz again
          </button>
          <Link
            to="/"
            className="hp-button rounded-lg border border-[var(--border)] px-4 py-2 text-[var(--text-secondary)]"
          >
            Back to mode select
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[var(--text-secondary)]">
        Question {step + 1} of {questions.length}
      </p>

      <div
        key={currentQuestion.id}
        className="animate-pop-in rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-lg text-[var(--text-primary)]"
      >
        {currentQuestion.prompt}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option)}
            className="hp-button rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-left font-medium text-[var(--text-primary)] hover:bg-white/5"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
