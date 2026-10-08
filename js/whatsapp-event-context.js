const key = value => String(value ?? '');
const day = value => key(value).slice(0, 10);
const opponent = value => key(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
export function linkedCallup(match, callups = []) {
  if (!match) return null;
  const direct = callups.find(c => (match.callupId && key(c.id) === key(match.callupId)) || (c.matchId && key(c.matchId) === key(match.id)));
  if (direct) return direct;
  const compatible = callups.filter(c => !c.matchId && opponent(c.opponent) && opponent(c.opponent) === opponent(match.opponent) && day(c.date) === day(match.date));
  return compatible.length === 1 ? compatible[0] : null;
}
export function resolveWhatsAppEvent(value, matches = [], callups = []) {
  if (!value) return { match: null, callup: null };
  if (value.startsWith('callup:')) {
    const callup = callups.find(c => key(c.id) === value.slice(7));
    if (!callup) return { match: null, callup: null };
    const match = matches.find(m => (callup.matchId && key(m.id) === key(callup.matchId)) || (m.callupId && key(m.callupId) === key(callup.id)));
    return { callup, match: match || { opponent: callup.opponent, date: callup.date, time: callup.time, location: callup.location || callup.pitch || '', mapsUrl: callup.mapsUrl || '', type: callup.matchType || 'league' } };
  }
  const id = value.startsWith('match:') ? value.slice(6) : value;
  const match = matches.find(m => key(m.id) === id) || null;
  return { match, callup: linkedCallup(match, callups) };
}
export function matchCommunicationDetails(match = {}) {
  const rawTime = key(match.time || key(match.date).split('T')[1]).slice(0, 5);
  const gameTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(rawTime) ? rawTime : '';
  const minutes = gameTime ? (Number(gameTime.slice(0, 2)) * 60 + Number(gameTime.slice(3)) - 45 + 1440) % 1440 : null;
  return { fieldName: key(match.location || match.pitch).trim(), mapsUrl: key(match.mapsUrl || match.googleMapsUrl || match.locationUrl).trim(), gameTime,
    callTime: minutes === null ? '' : `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}` };
}
export function whatsappMatchOptions(matches, callups, today, isPlayed, matchId = '', callupId = '') {
  return matches.filter(m => {
    const callup = linkedCallup(m, callups);
    // A direct Send action must retain its exact existing event; generic selectors only offer new pending events.
    if ((matchId && key(m.id) === key(matchId)) || (callupId && key(callup?.id) === key(callupId))) return true;
    return !isPlayed(m) && m.completed !== true && day(m.date) >= today && !callup && !m.callupId;
  }).sort((a, b) => key(a.date).localeCompare(key(b.date)));
}
