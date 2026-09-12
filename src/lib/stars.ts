export function visibleStars(stars: number, expiresAt: Date | null, now = new Date()) {
  return expiresAt && expiresAt <= now ? 0 : Math.max(0, Math.min(5, stars));
}
/** Placeholder: spending-based calculation is intentionally undefined. */
export function calculateStarsFromSpending(): null { return null; }
