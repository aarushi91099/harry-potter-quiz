# Hogwarts Trivia

An interactive Harry Potter quiz game with seven distinct trivia modes, built as a
client-side single-page app. No backend — everything runs and persists locally
in the browser.

## Quiz modes

| Mode | Description |
|---|---|
| **Popular Quotes** | Identify who said a famous line. |
| **Blurry Character Guess** | Name the character before the blur clears — earlier guesses score more. |
| **Spell vs Villain Challenge** | Pick the most effective spell for a magical scenario, with a speed bonus. |
| **Guess the Hogwarts House** | Match a personality/scenario to the right house. |
| **Guess the Creature** | Recognize a creature by silhouette, blur, or a synthesized sound cue. |
| **Finish the Dialogue** | Complete an iconic line of dialogue. |
| **Guess the Character** | Identify a character from progressively revealed clues. |

Every character/creature-identification mode uses a full, searchable catalog with
autocomplete — never a four-option multiple choice.

## Features

- **Gamification**: XP, levels that gate Easy/Medium/Hard difficulty, answer streaks
  with a score multiplier, unlockable achievements with toast notifications, and a
  local high-score leaderboard (all-time and weekly views).
- **Theming**: dark mode and four Hogwarts house color themes.
- **Mobile-first, responsive layout.**

## Tech stack

React 19 + TypeScript + Vite, Tailwind CSS v4, React Router, Zustand (with
`localStorage` persistence for progression/settings), Vitest + React Testing
Library for tests.

## Architecture

```
src/
  data/      Content datasets (characters, quotes, spells, creatures, dialogues, ...)
  engine/    Mode-agnostic game mechanics (question selection, clue reveal, blur timing)
  scoring/   Scoring rules, XP/streak/achievement systems
  store/     Zustand stores (session, persisted progression, settings, toasts)
  modes/     One folder per quiz mode's gameplay UI
  components/  Shared UI (search-select autocomplete, feedback banner, layout, ...)
  pages/     Routed screens (home, mode select, results, achievements, leaderboard, settings)
```

Content datasets are placeholder-asset only (generated avatar images, synthesized
tones for creature sounds) — see `PLAN.md` for the full rationale and phased build
plan this project was built from.

## Getting started

Requires Node 20.19+/22.12+ (see `.nvmrc`).

```bash
npm install
npm run dev       # start the dev server
npm test          # run the test suite (or: npx vitest run)
npm run build     # type-check + production build
```

## Project docs

- [`REQUEST.md`](./REQUEST.md) — the original product requirements this app was built from.
- [`PLAN.md`](./PLAN.md) — the phased implementation plan.
