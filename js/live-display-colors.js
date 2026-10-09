// Read-only projection: both live views display the same team choices.
const ids = {'live-match':'delegate-match','live-tactics':'delegate-tactics','clock':'delegate-clock','make-sub':'delegate-manual-sub','owner-auto-sub':'delegate-auto-sub','propose-reparto':'delegate-propose-reparto'};
export function delegateLiveSelector(selector) {
  if (typeof selector !== 'string' || !/^#partido(?: |$)/.test(selector)) return null;
  return selector.replace(/#([\w-]+)/g, (_, id) => '#' + (id === 'partido' ? 'delegado' : ids[id] || id));
}
export function liveColorSelector(selector) {
  if (typeof selector !== 'string' || !/^#partido(?: |$)/.test(selector)) return selector;
  const aliases = {'.cbx-live-score':'.score-team > strong','.cbx-live-clock':'.clock','.cbx-live-team':'.score-team > span','.player-timer':'.live-player-row','.timer-minutes':'.live-clock-badge','.player-minute-fill':'.live-bar-fill','.player-minute-track':'.live-bar-track','#goal-for-btn':'[data-cbx-live-kind="goal"]','#goal-against-btn':'[data-cbx-live-rival-goal]'};
  return selector.replace(/\.[\w-]+|#[\w-]+/g, token => aliases[token] || token);
}
export function liveDisplayTheme(theme = {}) {
  const next = structuredClone(theme);
  const live = next.views?.partido;
  // Resolve obsolete DOM names only in memory; keep saved choices intact.
  if (live) {
    for (const key of ['buttonColors','elementColors']) live[key] = Object.fromEntries(Object.entries(live[key] || {}).map(([selector,value]) => [liveColorSelector(selector),value]));
    if (live.uiParts) for (const choice of Object.values(live.uiParts)) if (choice) choice.selector = liveColorSelector(choice.selector);
  }
  if (!live) return next;
  const own = next.views?.delegado || {};
  const mirrored = {...live};
  for (const key of ['buttonColors','elementColors']) {
    mirrored[key] = Object.fromEntries(Object.entries(live[key] || {}).flatMap(([selector,value]) => {
      const mapped = delegateLiveSelector(selector);
      return mapped ? [[mapped,value]] : [];
    }));
  }
  mirrored.uiParts = Object.fromEntries(Object.entries(live.uiParts || {}).flatMap(([key,value]) => {
    const selector = delegateLiveSelector(value?.selector);
    return selector ? [[key,{...value,selector,viewId:'delegado'}]] : [];
  }));
  next.views.delegado = {...mirrored,...own};
  for (const key of ['buttonColors','elementColors','uiParts']) next.views.delegado[key] = {...mirrored[key],...own[key]};
  return next;
}
