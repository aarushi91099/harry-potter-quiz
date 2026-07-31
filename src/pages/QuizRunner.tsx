import { useParams } from 'react-router-dom';
import { modeById } from '../data/modeCatalog';
import { QuotesMode } from '../modes/quotes/QuotesMode';
import { SpellVsVillainMode } from '../modes/spellVsVillain/SpellVsVillainMode';
import { SortingHatMode } from '../modes/sortingHat/SortingHatMode';
import { FinishDialogueMode } from '../modes/finishDialogue/FinishDialogueMode';
import { GuessCharacterMode } from '../modes/guessCharacter/GuessCharacterMode';
import { BlurryCharacterMode } from '../modes/blurryCharacter/BlurryCharacterMode';
import { GuessCreatureMode } from '../modes/guessCreature/GuessCreatureMode';
import type { QuizMode } from '../engine/types';

export function QuizRunner() {
  const { modeId } = useParams<{ modeId: string }>();
  const mode = modeById.get(modeId as QuizMode);

  if (!mode) {
    return <p>Unknown quiz mode.</p>;
  }

  switch (mode.id) {
    case 'quotes':
      return <QuotesMode />;
    case 'spellVsVillain':
      return <SpellVsVillainMode />;
    case 'sortingHat':
      return <SortingHatMode />;
    case 'finishDialogue':
      return <FinishDialogueMode />;
    case 'guessCharacter':
      return <GuessCharacterMode />;
    case 'blurryCharacter':
      return <BlurryCharacterMode />;
    case 'guessCreature':
      return <GuessCreatureMode />;
  }
}
