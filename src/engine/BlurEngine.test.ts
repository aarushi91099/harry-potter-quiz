import { describe, expect, it } from 'vitest';
import { BlurEngine } from './BlurEngine';

describe('BlurEngine', () => {
  it('starts at full blur and earliness 1.0', () => {
    const engine = new BlurEngine({ startBlurPx: 20, endBlurPx: 0, durationMs: 10_000 });
    engine.start(0);
    expect(engine.blurPxAt(0)).toBe(20);
    expect(engine.earlinessAt(0)).toBe(1);
  });

  it('linearly decreases blur and earliness over time', () => {
    const engine = new BlurEngine({ startBlurPx: 20, endBlurPx: 0, durationMs: 10_000 });
    engine.start(0);
    expect(engine.blurPxAt(5_000)).toBeCloseTo(10);
    expect(engine.earlinessAt(5_000)).toBeCloseTo(0.5);
  });

  it('clamps at full reveal past duration', () => {
    const engine = new BlurEngine({ startBlurPx: 20, endBlurPx: 0, durationMs: 10_000 });
    engine.start(0);
    expect(engine.blurPxAt(20_000)).toBe(0);
    expect(engine.earlinessAt(20_000)).toBe(0);
    expect(engine.isFullyRevealedAt(20_000)).toBe(true);
  });
});
