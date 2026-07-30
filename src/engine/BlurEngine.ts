export interface BlurEngineOptions {
  /** Blur radius in px at t=0. */
  startBlurPx?: number;
  /** Blur radius in px once fully revealed. */
  endBlurPx?: number;
  /** Total time in ms to go from startBlurPx to endBlurPx. */
  durationMs?: number;
}

const DEFAULTS: Required<BlurEngineOptions> = {
  startBlurPx: 24,
  endBlurPx: 0,
  durationMs: 15_000,
};

/**
 * Computes blur radius as a function of elapsed time, and the score-relevant
 * "earliness" fraction (1 = guessed instantly, 0 = guessed at full reveal).
 * Pure/time-based so it can be driven by a UI timer or tested without one.
 */
export class BlurEngine {
  private readonly options: Required<BlurEngineOptions>;
  private startedAt: number | null = null;

  constructor(options: BlurEngineOptions = {}) {
    this.options = { ...DEFAULTS, ...options };
  }

  start(now: number = Date.now()): void {
    this.startedAt = now;
  }

  private elapsed(now: number): number {
    if (this.startedAt === null) return 0;
    return Math.min(now - this.startedAt, this.options.durationMs);
  }

  /** Current blur radius in px, given the current time. */
  blurPxAt(now: number = Date.now()): number {
    const { startBlurPx, endBlurPx, durationMs } = this.options;
    const t = this.elapsed(now) / durationMs;
    return startBlurPx + (endBlurPx - startBlurPx) * t;
  }

  /** 1.0 at the very start, decaying linearly to 0.0 once fully revealed. Used for scoring. */
  earlinessAt(now: number = Date.now()): number {
    const { durationMs } = this.options;
    return 1 - this.elapsed(now) / durationMs;
  }

  isFullyRevealedAt(now: number = Date.now()): boolean {
    return this.startedAt !== null && this.elapsed(now) >= this.options.durationMs;
  }
}
