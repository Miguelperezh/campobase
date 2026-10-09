// iOS/Android suspend polling and sockets while backgrounded. Reconcile on resume.
export function installForegroundSync(schedule, page = document, surface = window) {
  const resume = () => { if (page.visibilityState !== 'hidden') schedule(); };
  page.addEventListener('visibilitychange', resume);
  surface.addEventListener('focus', resume);
  surface.addEventListener('pageshow', resume);
  return () => {
    page.removeEventListener('visibilitychange', resume);
    surface.removeEventListener('focus', resume);
    surface.removeEventListener('pageshow', resume);
  };
}
