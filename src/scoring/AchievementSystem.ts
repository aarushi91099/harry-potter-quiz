import type { ProgressionStats } from './types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  check: (stats: ProgressionStats) => boolean;
}

/** Declarative achievement conditions, evaluated against cumulative progression stats after each answer. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'quote-master',
    name: 'Quote Master',
    description: 'Answer 50 quotes correctly.',
    check: (stats) => stats.correctByMode.quotes >= 50,
  },
  {
    id: 'creature-hunter',
    name: 'Creature Hunter',
    description: 'Answer 50 creature questions correctly.',
    check: (stats) => stats.correctByMode.guessCreature >= 50,
  },
  {
    id: 'spell-expert',
    name: 'Spell Expert',
    description: 'Answer 50 Spell vs Villain questions correctly.',
    check: (stats) => stats.correctByMode.spellVsVillain >= 50,
  },
  {
    id: 'house-scholar',
    name: 'House Scholar',
    description: 'Answer 50 Hogwarts House questions correctly.',
    check: (stats) => stats.correctByMode.guessHouse >= 50,
  },
  {
    id: 'character-detective',
    name: 'Character Detective',
    description: 'Answer 50 Guess the Character questions correctly.',
    check: (stats) => stats.correctByMode.guessCharacter >= 50,
  },
  {
    id: 'hogwarts-champion',
    name: 'Hogwarts Champion',
    description: 'Reach a 20-answer streak.',
    check: (stats) => stats.bestStreak >= 20,
  },
];

/** Returns achievements newly satisfied by `stats` that aren't already in `stats.unlockedAchievementIds`. */
export function checkNewAchievements(stats: ProgressionStats): Achievement[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !stats.unlockedAchievementIds.includes(achievement.id) && achievement.check(stats),
  );
}
