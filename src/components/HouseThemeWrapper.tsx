import type { ReactNode } from 'react';
import { useSettings } from '../store/useSettings';

const HOUSE_CLASS: Record<string, string> = {
  Gryffindor: 'house-gryffindor',
  Ravenclaw: 'house-ravenclaw',
  Hufflepuff: 'house-hufflepuff',
  Slytherin: 'house-slytherin',
};

/** Applies the player's chosen house's CSS custom properties (--house-primary etc.) to its subtree. */
export function HouseThemeWrapper({ children }: { children: ReactNode }) {
  const houseTheme = useSettings((s) => s.houseTheme);
  const className = houseTheme ? HOUSE_CLASS[houseTheme] : '';
  return <div className={className}>{children}</div>;
}
