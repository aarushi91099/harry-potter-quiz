# PLAN.md — Harry Potter Quiz Game (Frontend Application)

Derived from `REQUEST.md`. This plan covers architecture, data model, tech stack, and phased implementation for a client-side-only web app (no backend).

---

## 1. Tech Stack

* **React 18 + TypeScript + Vite** — component-based SPA, fast dev server, builds to static assets deployable anywhere (Netlify/Vercel/GitHub Pages/S3).
* **React Router** — screen navigation (home, mode select, in-quiz, results, achievements, leaderboard).
* **Zustand** — lightweight global state (XP, level, streak, achievements, session stats). Chosen over Context+useReducer because multiple unrelated slices (score engine, gamification, settings) need to update independently without prop drilling or re-render storms.
* **Tailwind CSS** — utility styling, dark mode (`dark:` variant), house theme via CSS custom properties/Tailwind theme extension.
* **Vitest + React Testing Library** — unit/component tests for scoring logic and quiz engine.
* **localStorage** (via a small persistence wrapper) — persists XP/level, achievements, best scores, "weekly" and "global" leaderboard entries (see §7 note on leaderboard scope).

No backend, no database, no auth. Everything runs client-side.

---

## 2. Media Assets — Placeholder Strategy

Real Harry Potter photos/audio are copyrighted and will **not** be sourced or bundled. Instead:

* **Character images**: generated placeholder avatars (initials-on-color, e.g. via a deterministic hash of the character name → background color, or a simple silhouette/person icon). Each character record has an `imageUrl` field so real art can be swapped in later without touching game logic.
* **Blurry Character Guess / Blurry creature mode**: use CSS `filter: blur(Npx)` applied to the same placeholder image, decreasing over time — no need for pre-blurred image variants.
* **Creature silhouettes**: CSS `filter: brightness(0)` / solid-color mask applied to the placeholder image, or a simple SVG silhouette shape.
* **Creature sounds**: placeholder short tones/noises (a few royalty-free/generated audio clips checked into `src/assets/audio/`), wired through the same `soundUrl` field so real sound design can be dropped in later.
* **Image attribution metadata**: schema includes an optional `attribution` field per asset (satisfies the REQUEST's "provide image attribution metadata if required" without committing to real sourced images now).

This keeps the data schema and UI components asset-agnostic — swapping placeholders for licensed media later is a data-file change, not a code change.

---

## 3. Architecture / Layer Separation

Per REQUEST.md's "separate game engine, content management, scoring, and UI layers":

```
src/
  data/                # Content Management Layer — static datasets, independently maintainable
    characters.ts       # full character catalog
    quotes.ts
    spells.ts
    creatures.ts
    dialogues.ts
    houses.ts
  engine/              # Game Engine Layer — mode-agnostic mechanics
    QuestionEngine.ts    # random selection, no-repeat tracking, difficulty filtering
    ClueEngine.ts        # progressive clue reveal (Guess the Character)
    BlurEngine.ts        # blur-level-over-time timer logic
    types.ts             # shared engine interfaces (Question, Attempt, Result)
  scoring/             # Scoring Layer
    ScoreCalculator.ts   # per-mode scoring rules, speed/early-guess bonuses
    XPSystem.ts          # XP grants, level thresholds, difficulty unlocks
    StreakSystem.ts       # streak tracking, multiplier
    AchievementSystem.ts  # achievement condition checks
  store/               # Zustand stores
    useGameSession.ts     # current session: score, accuracy, streak, answered set
    useProgression.ts     # persisted: XP, level, achievements, leaderboard entries
    useSettings.ts        # dark mode, house theme preference
  modes/               # UI Layer — one folder per quiz mode, each consuming engine+scoring
    quotes/
    blurryCharacter/
    spellVsVillain/
    guessHouse/
    guessCreature/
    finishDialogue/
    guessCharacter/
  components/          # Shared UI: CharacterSearchSelect, ClueList, ScoreBar, FeedbackPanel,
                        # DifficultyBadge, AchievementToast, HouseThemeWrapper
  pages/               # Home, ModeSelect, QuizRunner (generic shell), Results, Achievements,
                        # Leaderboard, Settings
  lib/
    persistence.ts       # localStorage read/write wrapper with versioned schema
    random.ts             # seeded/no-repeat random helpers
  App.tsx
  main.tsx
```

Key principle: **modes are thin** — each mode file defines "how to render a question of this type" and calls into `engine/` + `scoring/` for behavior, so adding an 8th quiz mode later (per REQUEST's future-proofing requirement) means adding one new dataset + one new mode folder, not touching shared logic.

---

## 4. Shared Data Model (Content Layer)

```ts
// data model sketch
interface Character {
  id: string;
  name: string;
  aliases: string[];        // for search/autocomplete matching
  house?: 'Gryffindor' | 'Ravenclaw' | 'Hufflepuff' | 'Slytherin';
  bloodStatus?: string;
  affiliation?: string[];
  occupation?: string;
  origin?: string;
  patronus?: string;
  firstAppearance?: string;
  knownFor?: string;
  magicalAbility?: string;
  gender?: string;
  imageUrl: string;
  attribution?: string;
  difficulty: 'easy' | 'medium' | 'hard'; // how "major" vs obscure, for question selection
}

interface Quote {
  id: string;
  text: string;
  characterId: string;      // references Character.id
  source: 'book' | 'movie';
  sourceTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  funFact?: string;
}

interface Spell {
  id: string;
  name: string;
  type: 'offensive' | 'defensive' | 'utility' | 'counter';
  effect: string;
}

interface SpellScenario {
  id: string;
  prompt: string;              // "A Dementor is approaching."
  correctSpellId: string;
  challengeType: 'villain' | 'creature' | 'curse' | 'obstacle';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface HouseScenario {
  id: string;
  prompt: string;
  correctHouse: 'Gryffindor' | 'Ravenclaw' | 'Hufflepuff' | 'Slytherin';
  reasoning: string;
  ambiguity: 'clear' | 'moderate' | 'nuanced'; // supports "increasingly ambiguous" requirement
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Creature {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  soundUrl?: string;
  attribution?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DialogueEntry {
  id: string;
  partial: string;           // "You're a wizard, _____"
  answer: string;            // "Harry"
  fullDialogue: string;
  source: 'book' | 'movie';
  difficulty: 'easy' | 'medium' | 'hard';
}
```

Each dataset lives in its own file/module and exports a typed array + a lookup-by-id map, so modes and the character search index can resolve cross-references (e.g., Quote → Character) cheaply.

**Character search index**: built once at app start (`Fuse.js` lightweight fuzzy search, or a simple normalized substring index over `name` + `aliases`) to power autocomplete across all three character-identification modes.

---

## 5. Quiz Mode Implementation Notes

All character-identification modes (**Quotes**, **Blurry Character Guess**, **Guess the Character**) use one shared component: `CharacterSearchSelect` — a searchable/autocomplete combobox over the full character catalog, never a 4-option multiple choice. This directly satisfies the REQUEST's hard constraint.

1. **Popular Quotes** — `QuestionEngine` filters `quotes` by difficulty, excludes already-seen ids this session, renders quote text + `CharacterSearchSelect`. On submit: reveal source (book/movie + title) and fun fact.
2. **Blurry Character Guess** — `BlurEngine` runs a timer reducing blur level (e.g., 20px → 0px over N seconds); `CharacterSearchSelect` accepts a guess at any time; score computed from elapsed-time-at-guess via `ScoreCalculator` (earlier = more points).
3. **Spell vs Villain Challenge** — scenario + searchable/select list of spells (full spell catalog, small enough to list directly rather than needing fuzzy search); speed bonus via elapsed-time capture; explanation shown after.
4. **Guess the Hogwarts House** — scenario + 4-way house selector (inherently 4 options — houses are a fixed enum, not subject to the "no four-option" constraint, which specifically targets character identification); reasoning shown after.
5. **Guess the Creature** — three sub-modes (Silhouette/Blurry/Sound) share one `CreatureSearchSelect` (same pattern as character search, over the creature catalog) rather than fixed options, since REQUEST doesn't exempt creatures from full-catalog identification; description shown after.
6. **Finish the Dialogue** — cloze-style text input (free text with fuzzy match against `answer`, tolerant of minor punctuation/case differences) or select-the-missing-phrase from a short in-context list; full dialogue revealed after.
7. **Guess the Character** — `ClueEngine` reveals clue categories one at a time (gender → affiliation → ability → ... ), `CharacterSearchSelect` available from clue 1 onward; score decreases per additional clue revealed before a correct guess.

---

## 6. Scoring, XP, Streaks, Achievements

* **ScoreCalculator**: per-mode function `computeScore(mode, context) → points`, where `context` captures mode-specific inputs (clue count, elapsed time, difficulty). Central so scoring rules are auditable and testable in isolation (Vitest).
* **StreakSystem**: increments on consecutive correct answers (session-scoped), applies a multiplier to points (e.g., +10% per streak step up to a cap); resets on wrong answer.
* **XPSystem**: correct answers grant XP (scaled by difficulty); level thresholds gate access to Hard difficulty content per mode.
* **AchievementSystem**: declarative condition list (e.g., `{ id: 'quote-master', check: (stats) => stats.quotes.correct >= 50 }`) evaluated after each answer; unlocked achievements persisted and toast-notified.
* **Session stats** (`useGameSession`): score, accuracy (%), current streak, best streak, questions answered/correct — reset per quiz session, summarized on the Results screen.
* **Persisted progression** (`useProgression`, localStorage): XP, level, unlocked achievements, per-mode best scores, and local "leaderboard" entries.

**Leaderboard scope note**: since this is a frontend-only app with no backend/auth, "Global" and "Weekly" leaderboards will be implemented as **local high-score tables** (this device only) rather than a real cross-user leaderboard. A true global leaderboard requires a backend + accounts, which REQUEST.md lists under future enhancements ("Friends leaderboard (future enhancement)") — flagging global/weekly as similarly deferred-in-spirit unless a backend is added later.

---

## 7. Difficulty & No-Repeat Question Selection

`QuestionEngine`:
* Filters a mode's dataset by requested difficulty (or difficulty unlocked via XP/level).
* Tracks an "already asked" id set per session (per mode) to avoid duplicates within that session.
* Random selection via `lib/random.ts` (Fisher-Yates shuffle of the filtered pool, consumed in order — guarantees no repeats until the pool is exhausted, then reshuffles).

---

## 8. UI / Styling

* **Mobile-first** Tailwind layout; touch-friendly tap targets for search results and selectors.
* **Dark mode**: Tailwind `dark:` classes driven by a `useSettings` toggle (persisted), default to system preference (`prefers-color-scheme`) with manual override. Hogwarts-inspired dark palette (deep greens/blacks/gold accents) as the dark theme baseline.
* **House theming**: CSS custom properties (`--house-primary`, `--house-accent`) set via a `HouseThemeWrapper` that reads the player's selected/sorted house (optional onboarding step) and themes buttons/borders/highlights accordingly, without forking component logic per house.

---

## 9. Phased Delivery

**Phase 1 — Foundation**
* Vite+React+TS scaffold, Tailwind setup, routing shell, dark mode toggle.
* `data/` schemas + a small seed dataset per category (~15–20 entries each) using placeholder assets.
* `engine/`, `scoring/`, `store/` core modules with unit tests.
* Shared `CharacterSearchSelect` / `CreatureSearchSelect` components with autocomplete.

**Phase 2 — Text-first Modes**
* Popular Quotes, Spell vs Villain, Guess the House, Finish the Dialogue (no timers/images needed — fastest to validate the engine end-to-end).
* Results screen, session stats, basic XP/streak wiring.

**Phase 3 — Media-driven Modes**
* Guess the Character (clue reveal), Blurry Character Guess (blur timer), Guess the Creature (silhouette/blur/sound sub-modes) using placeholder image/audio assets.

**Phase 4 — Gamification & Polish**
* Achievement system + toasts, level/XP unlock gating for Hard difficulty, local leaderboard (weekly/global-as-local) screen, house theming, mobile responsiveness pass, performance pass (image lazy-load, search debounce).

**Phase 5 — Content Expansion**
* Grow each dataset toward the full character/quote/spell/creature/dialogue universe (still placeholder assets unless real assets are sourced separately).

---

## 10. Explicit Assumptions / Deferred Items

* No backend/auth: "Global"/"Weekly" leaderboards are local-only high-score tables, not cross-device.
* No real HP images/audio bundled — placeholder generated assets only, with data fields ready for real assets later.
* Multiplayer duels, daily challenges, seasonal events, AI-generated trivia — explicitly out of scope per REQUEST.md's own "future enhancements" note.
