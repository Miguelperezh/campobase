// Device cache is fallback only. A team theme (including an explicit empty
// theme) is authoritative; absent keys must not revive old device choices.
export function resolveDisplayTheme(stored, cached = {}, preview = {}, isolated = false) {
  const valid = value => value && typeof value === 'object' && !Array.isArray(value);
  const base = isolated ? (valid(cached) ? cached : stored) : (valid(stored) ? stored : cached);
  return { ...(base || {}), ...(preview || {}), views: {
    ...(base?.views || {}), ...(preview?.views || {}),
  } };
}
