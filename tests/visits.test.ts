import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceDwell, distanceMeters, validatePresence } from '../src/lib/visits';
import { visibleStars, calculateStarsFromSpending } from '../src/lib/stars';
const start = new Date('2026-09-01T12:00:00Z');
const visit = { startedAt: start, lastSeenAt: new Date(start.getTime() + 240000), dwellSeconds: 240, minMinutes: 5, maxMinutes: 10, maxGapSeconds: 120 };
test('geofence accepts precise in-radius GPS and rejects distant or imprecise locations', () => {
  assert.equal(distanceMeters(-27.59, -48.54, -27.59, -48.54), 0);
  assert.ok(distanceMeters(-27.59, -48.54, -27.60, -48.54) > 1100);
  assert.equal(validatePresence(50, 20, 150, 100), null);
  assert.ok(validatePresence(140, 20, 150, 100));
  assert.ok(validatePresence(0, 101, 150, 100));
});
test('server dwell requires minimum, accepts exact minimum and accumulates periodic samples', () => {
  const before = advanceDwell(visit, new Date(start.getTime() + 299000), true);
  assert.equal(before.valid, false); assert.equal(before.retry, true);
  const exact = advanceDwell(visit, new Date(start.getTime() + 300000), true);
  assert.equal(exact.valid, true); assert.equal(exact.dwell, 300);
});
test('maximum stay and monitoring interruptions invalidate visit', () => {
  assert.equal(advanceDwell({ ...visit, lastSeenAt: new Date(start.getTime() + 590000) }, new Date(start.getTime() + 601000), true).valid, false);
  assert.equal(advanceDwell(visit, new Date(start.getTime() + 361000), false).valid, false);
});
test('star placeholder awards nothing and expiry hides expired stars', () => {
  assert.equal(calculateStarsFromSpending(), null);
  assert.equal(visibleStars(4, new Date('2026-08-01'), start), 0);
  assert.equal(visibleStars(4, new Date('2026-10-01'), start), 4);
  assert.equal(visibleStars(8, null, start), 5);
});
