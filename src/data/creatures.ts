import { placeholderAvatarUrl } from '../lib/avatarPlaceholder';
import { createSearchIndex } from '../lib/searchIndex';
import type { Creature } from './types';

function creature(c: Omit<Creature, 'imageUrl'>): Creature {
  return { ...c, imageUrl: placeholderAvatarUrl(c.name) };
}

/** Seed creature catalog (Phase 1), covering REQUEST.md's example creatures plus a few more. */
export const creatures: Creature[] = [
  creature({
    id: 'hippogriff',
    name: 'Hippogriff',
    description:
      'A proud, eagle-headed creature with the body of a horse; it demands a respectful bow before it will allow itself to be approached.',
    difficulty: 'medium',
  }),
  creature({
    id: 'niffler',
    name: 'Niffler',
    description:
      'A small, burrowing creature with a long snout and a pouch-like stomach, irresistibly drawn to anything shiny.',
    difficulty: 'easy',
  }),
  creature({
    id: 'basilisk',
    name: 'Basilisk',
    description:
      'A gigantic serpent whose gaze is instantly fatal to anyone who meets its eyes directly.',
    difficulty: 'medium',
  }),
  creature({
    id: 'thestral',
    name: 'Thestral',
    description:
      'A skeletal, winged horse-like creature, invisible to anyone who has not witnessed death.',
    difficulty: 'hard',
  }),
  creature({
    id: 'acromantula',
    name: 'Acromantula',
    description:
      'An enormous, intelligent spider capable of speech, living in large colonies deep in forests.',
    difficulty: 'medium',
  }),
  creature({
    id: 'hungarian-horntail',
    name: 'Hungarian Horntail',
    description:
      'One of the most aggressive dragon breeds, with black scales, bronze horns, and fire that can travel great distances.',
    difficulty: 'hard',
  }),
  creature({
    id: 'bowtruckle',
    name: 'Bowtruckle',
    description:
      'A small, twig-like tree-guardian creature, shy and fiercely protective of its home tree.',
    difficulty: 'easy',
  }),
  creature({
    id: 'dementor',
    name: 'Dementor',
    description:
      'A soulless, cloaked wraith that feeds on human happiness, leaving despair and cold in its wake.',
    difficulty: 'medium',
  }),
  creature({
    id: 'phoenix',
    name: 'Phoenix',
    description:
      'A magnificent, fire-associated bird that bursts into flame and is reborn from its own ashes.',
    difficulty: 'easy',
  }),
  creature({
    id: 'kneazle',
    name: 'Kneazle',
    description:
      'A cat-like magical creature with unusual intelligence, capable of sensing untrustworthy people.',
    difficulty: 'medium',
  }),
  creature({
    id: 'merperson',
    name: 'Merperson',
    description:
      'A water-dwelling magical being with a fish-like tail, found in lakes and seas near magical communities.',
    difficulty: 'medium',
  }),
  creature({
    id: 'centaur',
    name: 'Centaur',
    description:
      'A being with the upper body of a human and the lower body of a horse, deeply knowledgeable in astronomy and divination.',
    difficulty: 'medium',
  }),
  creature({
    id: 'werewolf',
    name: 'Werewolf',
    description:
      'A human afflicted with a curse that forces a monstrous wolf-like transformation at the full moon.',
    difficulty: 'medium',
  }),
  creature({
    id: 'boggart',
    name: 'Boggart',
    description: 'A shape-shifting creature that transforms into whatever its viewer fears most.',
    difficulty: 'easy',
  }),
  creature({
    id: 'grindylow',
    name: 'Grindylow',
    description:
      'A horned, green water demon that lurks in lakes and grabs at ankles with long fingers.',
    difficulty: 'medium',
  }),
  creature({
    id: 'doxy',
    name: 'Doxy',
    description:
      'A small, fairy-like pest with a double row of sharp teeth and a venomous bite.',
    difficulty: 'easy',
  }),
  creature({
    id: 'blast-ended-skrewt',
    name: 'Blast-Ended Skrewt',
    description:
      'A bred magical creature with a scorpion-like tail capable of emitting blasts of fire.',
    difficulty: 'hard',
  }),
  creature({
    id: 'erumpent',
    name: 'Erumpent',
    description:
      "A massive rhinoceros-like creature whose horn can cause a fatal explosion on contact.",
    difficulty: 'hard',
  }),
  creature({
    id: 'runespoor',
    name: 'Runespoor',
    description:
      'A three-headed magical snake native to Africa, with each head performing a different function.',
    difficulty: 'hard',
  }),
  creature({
    id: 'fwooper',
    name: 'Fwooper',
    description:
      "A brightly colored magical bird whose song can slowly drive a listener insane.",
    difficulty: 'medium',
  }),
];

export const creaturesById = new Map(creatures.map((c) => [c.id, c]));

export const creatureSearchIndex = createSearchIndex(
  creatures,
  (c) => c.name,
  () => [],
);
