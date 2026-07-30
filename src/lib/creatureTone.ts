import { hashString } from './hashString';

const MIN_FREQ_HZ = 220;
const MAX_FREQ_HZ = 880;
const BEEP_MS = 220;
const GAP_MS = 90;

/**
 * Placeholder "creature sound": a deterministic synthesized beep pattern derived
 * from the creature's id, standing in for real (copyrighted) sound design per
 * PLAN.md's placeholder-asset strategy. Frequency and beep count vary by id so
 * different creatures are audibly distinguishable. No-ops outside the browser
 * or where Web Audio isn't available (e.g. jsdom in tests).
 */
export function playCreatureTone(seed: string): void {
  const AudioContextCtor =
    typeof window !== 'undefined'
      ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
      : undefined;
  if (!AudioContextCtor) return;

  const hash = hashString(seed);
  const frequency = MIN_FREQ_HZ + (hash % (MAX_FREQ_HZ - MIN_FREQ_HZ));
  const beepCount = 1 + (hash % 3);

  const ctx = new AudioContextCtor();
  const beepDuration = BEEP_MS / 1000;
  const gap = GAP_MS / 1000;

  for (let i = 0; i < beepCount; i++) {
    const startAt = ctx.currentTime + i * (beepDuration + gap);
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency * (1 + i * 0.15);
    gainNode.gain.setValueAtTime(0.2, startAt);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + beepDuration);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + beepDuration);
  }

  const totalDurationMs = beepCount * (BEEP_MS + GAP_MS) + 50;
  setTimeout(() => ctx.close(), totalDurationMs);
}
