// Persisted team settings take precedence over an old device cache.
// Explicit previews remain temporary and never write settings.
export function resolveDisplayTheme(stored = {}, cached = {}, preview = {}, isolated = false) {
  const first = (isolated ? stored : cached) || {};
  const second = (isolated ? cached : stored) || {};
  return { ...first, ...second, ...(preview || {}), views: {
    ...(first.views || {}), ...(second.views || {}), ...(preview?.views || {}),
  } };
}
