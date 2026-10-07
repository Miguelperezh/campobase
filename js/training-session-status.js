// Read historical completion markers consistently without rewriting records.
export function isTrainingSessionCompleted(session) {
  return Boolean(session?.completed === true || session?.status === 'closed'
    || session?.status === 'finished' || session?.closedAt || session?.archived === true);
}
export function withTrainingSessionCompleted(session, completed, now = Date.now()) {
  const next = { ...session, completed, updatedAt: now };
  if (completed) { next.status = 'closed'; next.closedAt = now; }
  else {
    if (next.status === 'closed' || next.status === 'finished') delete next.status;
    delete next.closedAt;
    next.archived = false;
  }
  return next;
}
export function hasUsableTeamSnapshot(state) {
  return Boolean(state?.settings?.ownerPinHash && (
    state.players?.length || state.matches?.length || state.trainingSessions?.length));
}
