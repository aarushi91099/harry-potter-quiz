const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** True if `achievedAtIso` falls within the last 7 days of `now`. */
export function isWithinPastWeek(achievedAtIso: string, now: number = Date.now()): boolean {
  return now - new Date(achievedAtIso).getTime() <= WEEK_MS;
}
