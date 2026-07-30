import { describe, expect, it } from 'vitest';
import { useSettings } from './useSettings';

describe('useSettings', () => {
  it('sets an explicit house theme', () => {
    useSettings.getState().setHouseTheme('Slytherin');
    expect(useSettings.getState().houseTheme).toBe('Slytherin');
    useSettings.getState().setHouseTheme(null);
    expect(useSettings.getState().houseTheme).toBeNull();
  });
});
