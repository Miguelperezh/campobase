(() => {
  'use strict';

  const SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH';

  const THEME_PRESETS = {
    default: { bg:'#071711', card:'#0e261d', nav:'rgba(10,31,23,.96)', input:'#091c15', text:'#f8fafc', border:'#1b4d3a' },
    dark: { bg:'#040806', card:'#0a140e', nav:'rgba(8,18,13,.96)', input:'#060e0a', text:'#f8fafc', border:'#153023' },
    'pitch-vivid': { bg:'#021e12', card:'#06331f', nav:'rgba(4,38,23,.96)', input:'#032516', text:'#f0fdf4', border:'#125435' },
    navy: { bg:'#061021', card:'#0c1b33', nav:'rgba(10,24,46,.96)', input:'#081427', text:'#f8fafc', border:'#183359' },
    ocean: { bg:'#03141f', card:'#072436', nav:'rgba(5,27,41,.96)', input:'#041c2b', text:'#f0f9ff', border:'#0e4161' },
    charcoal: { bg:'#0f1113', card:'#181b1e', nav:'rgba(19,22,25,.96)', input:'#121417', text:'#f8fafc', border:'#282d33' },
    steel: { bg:'#171d24', card:'#222a34', nav:'rgba(28,36,46,.96)', input:'#1a222a', text:'#f8fafc', border:'#33404f' },
    burgundy: { bg:'#170408', card:'#260810', nav:'rgba(29,6,12,.96)', input:'#1d050a', text:'#fff1f2', border:'#45101d' },
    purple: { bg:'#110722', card:'#1d0e38', nav:'rgba(23,10,44,.96)', input:'#16092b', text:'#faf5ff', border:'#381c6b' },
    light: { bg:'#ffffff', card:'#ffffff', nav:'rgba(255,255,255,.96)', input:'#f8fafc', text:'#0f172a', border:'#e2e8f0' },
    warm: { bg:'#f6f3eb', card:'#ffffff', nav:'rgba(246,243,235,.96)', input:'#fbf9f4', text:'#292524', border:'#e5dfd3' },
    sepia: { bg:'#eee6d8', card:'#faf6ee', nav:'rgba(238,230,216,.96)', input:'#f4ede1', text:'#2d241e', border:'#d7cbb6' },
    'high-vis': { bg:'#000000', card:'#080808', nav:'rgba(0,0,0,.98)', input:'#000000', text:'#ffffff', border:'#facc15' },
  };

  const FONT_SCALE_MAP = {
    compact:'14.5px', normal:'16px', large:'19.2px', xlarge:'22.4px', huge:'25.6px', enormous:'28.8px', ultra:'32px',
  };
  const FONT_FAMILY_MAP = {
    system:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    sport:'"Barlow Condensed", "Oswald", "DIN Alternate", "Impact", -apple-system, sans-serif',
    readable:'"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    modern:'"Outfit", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    technical:'"JetBrains Mono", "SF Mono", "Menlo", "Monaco", "Consolas", monospace',
    classic:'"Merriweather", "Charter", "Georgia", "Cambria", "Times New Roman", serif',
  };
  const TEXT_COLOR_MAP = {
    'dark-slate':'#0f172a', 'pure-black':'#000000', 'high-contrast':'#000000', navy:'#0a1c36', 'pure-white':'#ffffff',
  };
  const FONT_WEIGHT_MAP = { normal:'400', semibold:'600', bold:'700', extrabold:'800', 'ultra-bold':'900' };

  const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const catalog = new Map((globalThis.__CAMPOBASE_CATALOG__ || []).map((item) => [String(item.id), item]));
  let sessions = new Map();
  let client = null;
  let patchQueued = false;

  function contrastFor(hex = '#c8102e') {
    const clean = String(hex).replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(clean)) return '#ffffff';
    const r = parseInt(clean.slice(0,2),16);
    const g = parseInt(clean.slice(2,4),16);
    const b = parseInt(clean.slice(4,6),16);
    return ((r * 299 + g * 587 + b * 114) / 1000) >= 135 ? '#0f172a' : '#ffffff';
  }

  function applyTheme(main = {}) {
    const theme = {
      themeBg:'default', accentColor:'#10b981', fontFamily:'system', fontScale:'normal', fontWeight:'bold', textColor:'dark-slate',
      ...(main.theme || {}),
    };
    const preset = THEME_PRESETS[theme.themeBg] || THEME_PRESETS.default;
    const fontColor = theme.fontColor || TEXT_COLOR_MAP[theme.textColor] || preset.text;
    const accent = theme.accentColor || '#10b981';
    const root = document.documentElement;

    root.style.setProperty('--field-bg', preset.bg);
    root.style.setProperty('--field-card', preset.card);
    root.style.setProperty('--field-nav', preset.nav);
    root.style.setProperty('--field-input', preset.input);
    root.style.setProperty('--field-text', fontColor || preset.text);
    root.style.setProperty('--field-border', preset.border);
    root.style.setProperty('--field-accent', accent);
    root.style.setProperty('--field-accent-text', contrastFor(accent));
    root.style.setProperty('--field-font-family', FONT_FAMILY_MAP[theme.fontFamily] || FONT_FAMILY_MAP.system);
    root.style.setProperty('--field-font-weight', FONT_WEIGHT_MAP[theme.fontWeight] || '700');
    root.style.fontSize = FONT_SCALE_MAP[theme.fontScale] || '16px';
    root.dataset.themeBg = theme.themeBg || 'default';
    root.dataset.themeFamily = theme.fontFamily || 'system';
    root.dataset.fontScale = theme.fontScale || 'normal';
    root.dataset.fontWeight = theme.fontWeight || 'bold';

    const meta = document.getElementById('campo-theme-color');
    if (meta) meta.content = accent;
  }

  function applyIdentity(main = {}) {
    const name = main.teamName?.trim() || 'Mi equipo';
    const crest = main.clubCrest || './icons/escudo.png';
    const nameNode = document.getElementById('campo-team-name');
    const crestNode = document.getElementById('campo-club-crest');
    if (nameNode) nameNode.textContent = name;
    if (crestNode) {
      crestNode.src = crest;
      crestNode.alt = `Escudo de ${name}`;
    }
    document.title = `${name} · Modo Campo`;
    applyTheme(main);
  }

  function exerciseFor(id) {
    const key = String(id || '');
    const fromCatalog = catalog.get(key);
    if (fromCatalog) return fromCatalog;
    return null;
  }

  function exerciseTitle(exercise, fallbackId = '') {
    return exercise?.nombre || exercise?.name || (fallbackId ? `Ejercicio ${fallbackId}` : 'Ejercicio');
  }

  function exerciseQuickMeta(exercise = {}) {
    const quick = exercise.datos_rapidos || {};
    return [
      quick.jugadores ? `👥 ${quick.jugadores}` : null,
      quick.espacio ? `📐 ${quick.espacio}` : null,
      quick.material ? `📦 ${quick.material}` : null,
    ].filter(Boolean);
  }

  function exerciseMedia(exercise = {}) {
    return {
      preview: exercise.media?.preview || exercise.preview || '',
      video: exercise.media?.video || exercise.video || '',
    };
  }

  function sessionExerciseList(session) {
    const blocks = Array.isArray(session?.blocks) ? session.blocks : [];
    if (!blocks.length) return '';
    return `<div class="campo-session-exercises"><strong>Ejercicios</strong>${blocks.map((block, index) => {
      const exercise = exerciseFor(block.exerciseId);
      const title = exerciseTitle(exercise, block.exerciseId);
      return `<div class="campo-session-exercise"><span>${index + 1}</span><b>${esc(title)}</b><em>${Number(block.duration) || '—'} min</em></div>`;
    }).join('')}</div>`;
  }

  function exerciseDetailMarkup(exercise, block) {
    if (!exercise) return '';
    const media = exerciseMedia(exercise);
    const steps = Array.isArray(exercise.como_se_hace) ? exercise.como_se_hace.filter(Boolean) : [];
    const quick = exerciseQuickMeta(exercise);
    const objective = exercise.objetivo_principal || (Array.isArray(exercise.que_se_trabaja) ? exercise.que_se_trabaja[0] : '') || '';
    const mediaMarkup = media.video
      ? `<video class="campo-exercise-video" controls playsinline preload="metadata" poster="${esc(media.preview)}"><source src="${esc(media.video)}" type="video/mp4"></video>`
      : media.preview ? `<img class="campo-exercise-preview" src="${esc(media.preview)}" alt="Vista del ejercicio ${esc(exerciseTitle(exercise))}">` : '';
    return `<section class="campo-exercise-detail" data-campo-exercise-detail>
      ${mediaMarkup}
      ${quick.length ? `<div class="campo-exercise-quick">${quick.map((item) => `<span class="pill">${esc(item)}</span>`).join('')}</div>` : ''}
      ${objective ? `<div class="card campo-exercise-objective"><h3>Objetivo</h3><p>${esc(objective)}</p></div>` : ''}
      ${steps.length ? `<div class="card campo-exercise-steps"><h3>Cómo hacerlo</h3><ol>${steps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol></div>` : ''}
      ${block?.notes ? `<div class="card"><h3>Consigna de esta sesión</h3><p class="big-copy">${esc(block.notes)}</p></div>` : ''}
    </section>`;
  }

  function patchSessionCards() {
    document.querySelectorAll('article.card[data-session-id]').forEach((card) => {
      if (card.querySelector('.campo-session-exercises')) return;
      const session = sessions.get(String(card.dataset.sessionId));
      if (!session) return;
      const meta = card.querySelector('.meta');
      if (meta) meta.insertAdjacentHTML('afterend', sessionExerciseList(session));
    });
  }

  function patchExerciseOverlay() {
    const title = document.querySelector('#overlay:not(.hidden) .field-title');
    if (!title) return;
    const text = title.textContent.trim();
    const match = /^Ejercicio\s+(.+)$/i.exec(text);
    if (!match) return;
    const id = match[1].trim();
    const exercise = exerciseFor(id);
    if (!exercise) return;
    title.textContent = exerciseTitle(exercise, id);
    const overlayBody = title.closest('#overlay-body');
    if (!overlayBody || overlayBody.querySelector('[data-campo-exercise-detail]')) return;
    const sessionId = document.querySelector('#overlay:not(.hidden) [data-attendance-session]')?.dataset.attendanceSession;
    const session = sessions.get(String(sessionId || ''));
    const block = session?.blocks?.find((item) => String(item.exerciseId) === id) || null;
    const meta = title.nextElementSibling;
    if (meta) meta.insertAdjacentHTML('afterend', exerciseDetailMarkup(exercise, block));
  }

  function normalizeVisibleCopy() {
    const sync = document.getElementById('sync');
    if (sync && /Supabase|jugadores|sesiones|partidos|asistencias/i.test(sync.textContent || '')) sync.textContent = 'Actualizado';
    document.querySelectorAll('.source-proof').forEach((node) => node.remove());
    document.querySelectorAll('.hero p').forEach((node) => {
      if (/Prueba independiente|Supabase/i.test(node.textContent || '')) node.textContent = 'Consulta rápida de entrenos y partidos.';
    });
  }

  function patch() {
    patchSessionCards();
    patchExerciseOverlay();
    normalizeVisibleCopy();
  }

  function queuePatch() {
    if (patchQueued) return;
    patchQueued = true;
    requestAnimationFrame(() => {
      patchQueued = false;
      patch();
    });
  }

  async function readSettings() {
    if (!client) return;
    const { data, error } = await client.from('configuracion').select('id,payload,deleted_at').is('deleted_at', null);
    if (error) throw error;
    const payloads = (data || []).map((row) => row.payload).filter(Boolean);
    const main = payloads.find((item) => item.id === 'main') || {};
    sessions = new Map(payloads.filter((item) => item.recordType === 'trainingSession').map((item) => [String(item.id), item]));
    applyIdentity(main);
    queuePatch();
  }

  async function init() {
    if (!globalThis.supabase?.createClient) return;
    client = globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } });
    await readSettings().catch((error) => console.warn('No se pudo aplicar la identidad de Modo Campo:', error));
    const observer = new MutationObserver(queuePatch);
    observer.observe(document.body, { childList:true, subtree:true, characterData:true });
    queuePatch();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') readSettings().catch(() => {});
  });
  window.addEventListener('pageshow', () => readSettings().catch(() => {}));

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();