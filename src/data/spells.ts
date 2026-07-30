import type { Spell } from './types';

/** Seed spell catalog (Phase 1), covering offensive/defensive/utility/counter types per REQUEST.md. */
export const spells: Spell[] = [
  { id: 'expelliarmus', name: 'Expelliarmus', type: 'offensive', effect: "Disarms the target, causing their wand to fly out of their hand." },
  { id: 'stupefy', name: 'Stupefy', type: 'offensive', effect: 'Stuns the target, rendering them unconscious.' },
  { id: 'avada-kedavra', name: 'Avada Kedavra', type: 'offensive', effect: 'The Killing Curse; causes instant death.' },
  { id: 'crucio', name: 'Crucio', type: 'offensive', effect: 'Inflicts unbearable pain on the target.' },
  { id: 'sectumsempra', name: 'Sectumsempra', type: 'offensive', effect: 'Slashes the target as if with an invisible sword.' },
  { id: 'bombarda', name: 'Bombarda', type: 'offensive', effect: 'Causes a small, controlled explosion.' },
  { id: 'petrificus-totalus', name: 'Petrificus Totalus', type: 'offensive', effect: "Binds the target's body rigidly, rendering them immobile." },
  { id: 'expecto-patronum', name: 'Expecto Patronum', type: 'defensive', effect: 'Conjures a Patronus to repel Dementors and Lethifolds.' },
  { id: 'protego', name: 'Protego', type: 'defensive', effect: 'Creates a shield that deflects spells and physical objects.' },
  { id: 'riddikulus', name: 'Riddikulus', type: 'counter', effect: 'Forces a Boggart to take a comical, harmless form.' },
  { id: 'finite-incantatem', name: 'Finite Incantatem', type: 'counter', effect: 'Ends the effects of most spells and enchantments.' },
  { id: 'alohomora', name: 'Alohomora', type: 'utility', effect: 'Unlocks doors and other locked objects.' },
  { id: 'wingardium-leviosa', name: 'Wingardium Leviosa', type: 'utility', effect: 'Levitates and moves objects.' },
  { id: 'accio', name: 'Accio', type: 'utility', effect: 'Summons an object to the caster.' },
  { id: 'lumos', name: 'Lumos', type: 'utility', effect: "Illuminates the tip of the caster's wand." },
  { id: 'obliviate', name: 'Obliviate', type: 'utility', effect: "Erases specific memories from the target." },
  { id: 'legilimens', name: 'Legilimens', type: 'utility', effect: "Allows the caster to read another person's surface thoughts and memories." },
  { id: 'confringo', name: 'Confringo', type: 'offensive', effect: 'Causes a powerful fiery explosion on impact.' },
  { id: 'reducto', name: 'Reducto', type: 'offensive', effect: 'Blasts the target object to pieces.' },
  { id: 'impedimenta', name: 'Impedimenta', type: 'defensive', effect: 'Slows down or freezes an approaching attacker.' },
  { id: 'incendio', name: 'Incendio', type: 'utility', effect: 'Produces or conjures fire.' },
  { id: 'episkey', name: 'Episkey', type: 'utility', effect: 'Heals minor injuries like small cuts and broken noses.' },
  { id: 'sonorus', name: 'Sonorus', type: 'utility', effect: "Magically amplifies the caster's voice." },
  { id: 'morsmordre', name: 'Morsmordre', type: 'utility', effect: 'Conjures the Dark Mark into the sky.' },
  { id: 'avis', name: 'Avis', type: 'utility', effect: 'Conjures a flock of small birds.' },
];

export const spellsById = new Map(spells.map((s) => [s.id, s]));
