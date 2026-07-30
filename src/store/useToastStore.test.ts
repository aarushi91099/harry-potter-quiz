import { beforeEach, describe, expect, it } from 'vitest';
import { useToastStore } from './useToastStore';
import { useGameSession } from './useGameSession';
import { useProgression } from './useProgression';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('pushes one toast per newly unlocked achievement', () => {
    useToastStore.getState().pushToasts([
      { id: 'a', name: 'A', description: '', check: () => true },
      { id: 'b', name: 'B', description: '', check: () => true },
    ]);
    expect(useToastStore.getState().toasts).toHaveLength(2);
  });

  it('does nothing when pushed an empty list', () => {
    useToastStore.getState().pushToasts([]);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('dismiss removes only the matching toast', () => {
    useToastStore.getState().pushToasts([{ id: 'a', name: 'A', description: '', check: () => true }]);
    const [toast] = useToastStore.getState().toasts;
    useToastStore.getState().dismiss(toast.id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});

describe('useGameSession -> useToastStore wiring', () => {
  beforeEach(() => {
    useGameSession.getState().start('quotes', 'easy');
    useProgression.getState().reset();
    useToastStore.setState({ toasts: [] });
  });

  it('pushes a toast when an answer crosses an achievement threshold', () => {
    for (let i = 0; i < 49; i++) {
      useGameSession.getState().submitAnswer({
        mode: 'quotes',
        questionId: `q${i}`,
        difficulty: 'easy',
        correct: true,
      });
    }
    // 49 straight correct answers also crosses the 20-streak "Hogwarts Champion"
    // achievement — clear that unrelated toast so this test only asserts on quote-master.
    useToastStore.setState({ toasts: [] });

    useGameSession.getState().submitAnswer({
      mode: 'quotes',
      questionId: 'q49',
      difficulty: 'easy',
      correct: true,
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts.some((t) => t.achievement.id === 'quote-master')).toBe(true);
  });
});
