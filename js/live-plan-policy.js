import { normalizeMoments } from './match-moments.js';

// Read-only selection: no generated repartition may replace a saved plan.
export function nextSavedPlanWindow(prep, timer = {}, { minute = 0, alert = false } = {}) {
  const hasPlan = Boolean(prep?.team?.length || prep?.moments?.some((m) => m.team?.length));
  if (!hasPlan) return { hasPlan: false, moment: null, before: null };
  const moments = normalizeMoments(prep);
  const done = new Set(timer.planDone || []);
  const deferred = new Set(timer.planDeferred || []);
  const closed = new Set(timer.planAlertClosed || []);
  const index = moments.findIndex((m, i) => i > 0 && !done.has(m.id) && !deferred.has(m.id)
    && (!alert || (!closed.has(m.id) && minute >= m.minute - 1)));
  return { hasPlan: true, moment: index < 0 ? null : moments[index], before: index < 0 ? null : moments[index - 1] };
}
