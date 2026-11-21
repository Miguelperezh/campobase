const BUILD = '20261121-player-delete-1';
const CACHE = '20261121-player-delete-1-20261118-mobile-start-1-20261117-calendar-rests-1-20261024-pilot-flows-1-20261023-whatsapp-call-time-1-20261022-pilot-safety-1-20261021-save-postmatch-1-20261021-postmatch-callups-2-20261021-postmatch-callups-1-20261020-sessions-1-20261008-whatsapp-context-1-20261008-fix-pin-login-exercise-covers-speed-1-20261008-fix-convocatorias-calero-sync-2-callups-played-sync-1-20261007-fluid-refresh-1-20261006-telefonos-padres-1-campobase-v2.44.0-player-sync-attendance-2453-responsive-2455-today-2457-sessiontop-2458-sessionplanner-2461-exerciseboard-2475-themev12-v2-248-fullscreen-dates-playfix-duration-2503-whatsapp-web-f7-50-v2528-exercise-content-audit-mirror-materials-orientation-session-audit-copy-hotfix-badge-cleanup-pwa-install-v2-250917-promo-roster-1-saas-auth-v3-attendance-manual-v4-exercises-hotfix-v2-auth-recovery-v1-player-profile-guard-v1-exercise-media-filter-v2-derived-stats-link-v1-manual-player-profile-v1-exercise-cover-humanvideo-hotfix-20260918-force2508-final-preview-own-sessions-emergency-auth-restore-v4-prod-access-recovery-v1-session-rebind-v1-pin-session-preserve-v1-session-data-view-v1-mobile-sync-pin-v1-cloud-restore-v4-20260927-v66-real-calendar-dates-20261001-v69-ajustes-temas-20261002-v70-ajustes-pizarra-sidebar-20261002-v71-ajustes-preview-rico-bg-tacticas-fix-20261002-v72-ajustes-live-preview-completo-20261002-v73-preview-top-hoy-quick-buttons-fix-20261002-v74-mobile-settings-grid-responsive-fix-20261002-v75-remove-dummy-tactics-presets-20261002-v76-mobile-print-pdf-specialists-theme-fix-20261003-v77-match-plan-2pages-70min-callups-theme-fab-fix-20261008-v80-lotes-151-1050-1285-ejercicios-audio-player';
const BOARD_PARTS = [
  './assets/exercise-board/part-1.b64',
  './assets/exercise-board/part-2.b64',
  './assets/exercise-board/part-3.b64',
  './assets/exercise-board/part-4.b64',
];
const ASSETS = [
  './js/app.js?v=20261121-player-delete-1',
  './js/db.js?v=20261121-player-delete-1',
  './js/player-data-sync.js?v=20261121-player-delete-1',
  './js/app.js?v=20261118-mobile-start-1',
  './js/saas-auth-ui-v2.js?v=20261118-mobile-start-1',
  './js/saas-session-guard.js?v=20261118-mobile-start-1',
  './js/print-session-export.js?v=20261118-mobile-start-1',
  './js/app.js?v=20261117-calendar-rests-1',
  './supabase/functions/_shared/delegate-policy.mjs?v=20261117-calendar-rests-1',
  './js/demo-session.js?v=20261024-pilot-flows-1', './js/cloud-ui-bootstrap.js?v=20261024-pilot-flows-1',
  './js/app.js?v=20261024-pilot-flows-1',
  './js/redesign-nav.js?v=20261024-pilot-flows-1',
  './js/db.js?v=20261024-pilot-flows-1',
  './js/today-dashboard.js?v=20261024-pilot-flows-1',
  './js/runtime-refresh.js?v=20261024-pilot-flows-1',
  './js/attendance-linked-sources.js?v=20261024-pilot-flows-1',
  './js/sync-status.js?v=20261024-pilot-flows-1',
  './css/sync-feedback.css?v=20261024-pilot-flows-1',
  './js/app.js?v=20261023-whatsapp-call-time-1', './js/whatsapp-suite.js?v=20261023-whatsapp-call-time-1',
  './js/staff-management.js?v=20261022-pilot-safety-1',
  './js/demo-session-core.js?v=20261022-pilot-safety-1', './js/demo-session.js?v=20261022-pilot-safety-1', './js/domain.js?v=20261022-pilot-safety-1',
  './js/cloud-ui-bootstrap.js?v=20261022-pilot-safety-1',
  './js/app.js?v=20261022-pilot-safety-1',
  './js/db.js?v=20261022-pilot-safety-1',
  './js/auth-manager.js?v=20261022-pilot-safety-1',
  './js/backup-safety.js?v=20261022-pilot-safety-1',
  './js/account-view-context.js?v=20261022-pilot-safety-1',
  './js/supabase-client.js?v=20261022-pilot-safety-1',
  './js/team-access.js?v=20261022-pilot-safety-1',
  './js/redesign-nav.js?v=20261022-pilot-safety-1',
  './js/modo-campo-directo.js?v=20261022-pilot-safety-1',
  './js/modo-campo-identity-exercises.js?v=20261022-pilot-safety-1',
  './js/modo-campo-integration.js?v=20261022-pilot-safety-1',
  './js/modo-campo-local-theme.js?v=20261022-pilot-safety-1',
  './js/modo-campo-actions.js?v=20261022-pilot-safety-1',
  './supabase/functions/_shared/delegate-policy.mjs?v=20261022-pilot-safety-1',
  './js/redesign-nav.js?v=20261021-save-postmatch-1', './js/demo-session.js?v=20261021-save-postmatch-1', './js/today-dashboard.js?v=20261021-save-postmatch-1',
  './js/app.js?v=20261021-save-postmatch-1',
  './js/supabase-client.js?v=20261021-save-postmatch-1',
  './js/player-data-sync.js?v=20261021-save-postmatch-1',
  './js/match-postgame-editor.js?v=20261021-save-postmatch-1',
  './js/postgame-goals.js?v=20261021-save-postmatch-1',
  './js/postmatch-callup.js?v=20261021-save-postmatch-1',
  './js/form-save-feedback.js?v=20261021-save-postmatch-1',
  './js/domain.js?v=20261021-postmatch-callups-2',
  './js/app.js?v=20261021-postmatch-callups-2',
  './js/app.js?v=20261021-postmatch-callups-1', './js/db.js?v=20261021-postmatch-callups-1', './js/postmatch-callup.js?v=20261021-postmatch-callups-1', './js/whatsapp-suite.js?v=20261021-postmatch-callups-1', './styles.css?v=20261021-postmatch-callups-1',
  './js/training-session-tools.js?v=20261020-sessions-1', './js/db.js?v=20261020-sessions-1', './js/demo-session.js?v=20261020-sessions-1', './styles.css?v=20261020-sessions-1',
  './js/session-visual-planner.js?v=20261020-sessions-1',
  './js/app.js?v=20261020-sessions-1', './js/training-session-delete.js?v=20261020-sessions-1',
  './js/app.js?v=20261018-match-edit-2', './js/match-postgame-editor.js?v=20261018-match-edit-2', './js/supabase-client.js?v=20261018-match-edit-2', './js/player-data-sync.js?v=20261018-match-edit-2',
  './js/match-moments.js?v=claude-partido-5',
  './js/app.js?v=20261018-offline-match-1', './js/postgame-plan.js?v=20261018-offline-match-1', './js/match-postgame-editor.js?v=20261018-offline-match-1', './js/keeper-goals.js?v=20261018-offline-match-1', './js/supabase-client.js?v=20261018-offline-match-1', './js/player-data-sync.js?v=20261018-offline-match-1', './js/completed-events-ui.js?v=20261018-offline-match-1',
  './js/domain.js?v=20261009-postgame-sync-1', './js/match-postgame-editor.js?v=20261009-postgame-sync-1', './js/player-data-sync.js?v=20261009-postgame-sync-1', './js/plantilla-stats-sync.js?v=20261009-postgame-sync-1', './js/supabase-client.js?v=20261009-postgame-sync-1', './js/keeper-goals.js?v=20261009-postgame-sync-1', './js/postgame-goals.js?v=20261009-postgame-sync-1', './js/foreground-sync.js?v=20261009-postgame-sync-1',
  './styles-learning.css?v=20261010-learning-1', './js/learning-ui.js?v=20261010-learning-1', './js/learning-domain.js?v=20261010-learning-1', './js/learning-color-controls.js?v=20261010-learning-1', './js/claude-color-bindings.js?v=20261010-learning-1', './js/app.js?v=20261016-print-visual-1',
  './js/whatsapp-suite.js?v=20261008-whatsapp-context-1',
  './js/whatsapp-event-context.js',
  './js/time-plan-color-controls.js',
  './js/db.js?v=20261009-postgame-sync-1',
  './js/sync-core.js?v=20261009-postgame-sync-1',
  './styles.css?v=20261008-pos-contrast-4',
  './styles-redesign.css?v=20261008-pos-contrast-4',
  './styles-claude-proposal.css?v=20261009-postgame-sync-1', './js/claude-color-editor.js?v=20261010-learning-1', './js/claude-color-bindings.js?v=20261010-learning-1', './js/claude-color-catalog.js', './js/claude-time-plan.js?v=20261009-postgame-sync-1', './js/individual-time-plan.js',
  './js/demo-session.js?v=goal-series-1', './js/redesign-nav.js?v=20261010-learning-1',
  './js/app.js?v=pin-login-exercise-covers-speed-1', './js/app.js?v=fluid-refresh-1', './js/theme-component-colors.js?v=20261009-postgame-sync-1', './js/settings-visual-ui.js?v=claude-proposal-3',
  './css/campobase-diseno.css?v=hoy-real-2',
  './css/claude-partido.css?v=plan-intuitivo-5', './css/claude-partido.css?v=20261009-postgame-sync-1',
  './css/match-window-editor.css?v=windows-1',
  './css/theme-component-colors.css?v=claude-proposal-3',
  './js/app.js?v=player-edit-1',
  './js/attendance-linked-sources.js?v=claude-asistencia-3',
  './js/calendar-substitutions-entry.js?v=2447',
  './js/demo-session.js?v=claude-asistencia-3',
  './js/legacy-data-link-guard.js?v=1',
  './js/match-moments.js', './js/live-plan-policy.js',
  './js/display-theme.js',
  './js/match-window-editor.js?v=player-edit-1',
  './js/match-window-plan.js',
  './js/match-window-plan.js?v=windows-1',
  './js/minute-timeline.js?v=player-edit-1',
  './js/preview-readonly.js?v=claude-partido-2',
  './js/redesign-nav.js?v=claude-tecnicos-1',
  './js/reparto-plan.js',
  './js/settings-visual-ui.js?v=visual-4',
  './js/staff-management.js?v=claude-tecnicos-1',
  './js/tacticas-pdf-domain.js',
  './js/theme-component-colors.js?v=color-controls-9',

  './styles-redesign.css?v=delegate-refresh-1',
  './css/claude-shell.css?v=color-controls-8',
  './css/claude-hoy.css?v=goal-series-1',
  './css/claude-plantilla.css?v=telefonos-padres-1',
  './css/claude-partido.css?v=color-controls-8',
  './css/claude-entreno.css?v=color-controls-8',
  './js/theme-component-colors.js', './js/theme-component-colors.js?v=color-controls-8', './css/theme-component-colors.css', './css/theme-component-colors.css?v=claude-proposal-3', './js/app.js?v=color-controls-8',
  './', './index.html', './styles.css', './styles.css?v=20260927-v66-real-calendar-dates', './styles-redesign.css', './styles-redesign.css?v=20260927-v66-real-calendar-dates', './billing.css', './billing.css?v=1', './manifest.webmanifest', './pwa-install.css', './pwa-install.css?v=2',
  './css/claude-partido.css', './css/claude-partido.css?v=20261001-v65-matchplan',
  './modo-campo-directo.html', './modo-campo-directo.css', './modo-campo-directo.css?v=4', './modo-campo-theme.css', './modo-campo-theme.css?v=3', './modo-campo-flow.css', './modo-campo-flow.css?v=1',
  './js/minute-timeline.js', './js/minute-timeline.js?v=plan-visual-2', './js/session-detail-navigation.js', './js/exercise-preview-image.js', './js/ejercicio-viewer.js?v=plan-visual-1',
  './supabase/functions/_shared/delegate-policy.mjs',
  './js/live-display-colors.js?v=20261009-postgame-sync-1', './js/live-display-colors.js', './js/app.js', './js/app.js?v=20260927-v66-real-calendar-dates', './js/db.js?v=20261009-postgame-sync-1', './js/db.js', './js/domain.js', './js/whatsapp-suite.js', './js/demo-session.js', './js/training-domain.js', './js/real-exercises.js', './js/exercise-planning.js', './js/ejercicios-validados.js', './js/ejercicios-validados-base.js', './js/ejercicios-nuevo-formato.js', './js/ejercicios-nuevos-lotes.js', './js/ejercicios-lotes-151-650.js', './js/ejercicio-viewer.js', './js/ejercicio-videos.js',  './js/print-session-export.js?v=color-controls-8', './js/print-session-export.js', './js/print-session-export.js?v=20260927-v66-real-calendar-dates', './js/print-match-plan.js', './js/print-match-plan.js?v=20261001-v65-matchplan', './js/media-lightbox.js', './js/frame-durations.js', './js/tactics.js', './js/live-tactics.js', './js/tacticas-interactivas.js', './js/tactica-viewer.js', './js/tactica-frame-durations.js', './js/tactica-1231-frames.js', './js/tactica-1213-frames.js', './js/tactica-1321-frames.js', './js/tactica-1222-frames.js', './js/tactica-1132-frames.js', './js/tactica-133-frames.js', './js/tactica-1312-frames.js', './js/tactica-final-frames.js', './js/tactica-11311-frames.js', './js/tactica-1141-frames.js', './js/tactica-1411-frames.js', './js/tactica-12211-frames.js', './js/tactic-board-controller.js', './js/tactica-guia-viewer.js', './js/squad-seed.js', './js/sync-core.js', './js/sync-core.js?v=20261009-postgame-sync-1', './js/supabase-client.js', './js/supabase-client.js?v=20261009-postgame-sync-1', './js/auth-manager.js', './js/saas-session-guard.js', './js/saas-session-guard.js?v=1', './js/saas-auth-ui.js', './js/saas-auth-ui.js?v=1', './js/saas-auth-ui-v2.js?v=20261009-postgame-sync-1', './js/saas-auth-ui-v2.js', './js/saas-auth-ui-v2.js?v=20260927-v66-real-calendar-dates', './js/player-roster-guard.js', './js/player-roster-guard.js?v=1', './js/billing-manager.js', './js/billing-manager.js?v=1', './js/plan-catalog.js', './js/team-access.js', './js/team-access.js?v=1', './js/team-access.js?v=20261009-postgame-sync-1', './js/promo-codes-admin.js', './js/promo-codes-admin.js?v=4', './js/promo-codes-ui-v2.js', './js/promo-codes-ui-v2.js?v=2', './js/plantilla-stats-sync.js', './js/match-calendar-sync.js', './js/completed-events-ui.js', './js/training-session-status.js', './js/exercise-view-mode-ui.js?v=20260927-v66-real-calendar-dates', './js/match-postgame-editor.js', './js/calendar-substitutions-v2.js', './js/calendar-substitutions-entry.js', './js/session-visual-planner.js?v=plan-visual-1', './js/session-materials.js?v=2452', './js/session-top-actions.js?v=2458', './js/session-picker-compat.js?v=2461', './js/session-planner-ui.js?v=20260927-v66-real-calendar-dates', './js/attendance-linked-sources.js', './js/attendance-linked-sources.js?v=2453', './js/attendance-session-manual-state.js', './js/attendance-session-manual-state.js?v=fluid-refresh-1', './js/player-data-sync.js?v=2453', './js/player-data-sync.js?v=1', './js/attendance-history-responsive.js?v=2455', './js/today-dashboard.js?v=goal-series-1', './js/exercise-board-persistence.js?v=20260927-v66-real-calendar-dates', './js/runtime-refresh.js?v=20261009-postgame-sync-1', './js/exercise-viewer-controls.js?v=2475', './js/exercise-viewer-layout.js?v=plan-visual-1', './js/staff-management.js', './js/image-crop-utils.js', './js/redesign-nav.js', './js/redesign-nav.js?v=20260927-v66-real-calendar-dates', './js/pwa-install-manager.js', './js/pwa-install-manager.js?v=1', './js/pwa-install-manager.js?v=2',
  './js/modo-campo-directo.js', './js/modo-campo-directo.js?v=4', './js/modo-campo-identity-exercises.js', './js/modo-campo-identity-exercises.js?v=2', './js/modo-campo-theme-parity.js', './js/modo-campo-theme-parity.js?v=1', './js/modo-campo-actions.js', './js/modo-campo-actions.js?v=2', './js/modo-campo-integration.js', './js/modo-campo-integration.js?v=1', './js/session-reorder-ui.js', './js/session-reorder-ui.js?v=3', './js/detail-badge-runtime-fix.js', './js/detail-badge-runtime-fix.js?v=3', './js/session-editor-usability.js', './js/session-editor-usability.js?v=1', './js/custom-exercise-persistence.js', './js/custom-exercise-persistence.js?v=1', './js/exercise-content-quality.js', './js/exercise-content-quality.js?v=1', './js/exercise-vocabulary-ui.js', './js/exercise-vocabulary-ui.js?v=1', './js/exercise-content-audit.js', './js/exercise-content-audit.js?v=1',
  './library-v2/data/catalog.json', './library-v2/data/catalog-data.js',
  ...BOARD_PARTS,
  './vendor/supabase.js',
  './vendor/html2canvas.min.js',
  './vendor/jspdf.umd.min.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-192.svg', './icons/icon-512.svg', './icons/escudo.png',
  // Exact static dependencies absent from the historical cache list.
  './js/detail-badge-runtime-fix.js?v=4',
  './js/display-theme.js?v=20261009-postgame-sync-1',
  './js/ejercicios-nuevo-formato/01-campobase-video-3-finalizaciones-centro-exterior-centro-lateral.js',
  './js/ejercicios-nuevo-formato/02-campobase-video-6-saltos-laterales-knee-drive-sprint-13-7m.js',
  './js/ejercicios-nuevo-formato/03-campobase-video-conduccion-dejar-balon-3-conos-vuelta-lateral-pase.js',
  './js/ejercicios-nuevo-formato/04-campobase-video-conduccion-frenada-planta-sprint-ida-vuelta-recuperacion.js',
  './js/ejercicios-nuevo-formato/05-campobase-video-desplazamiento-lateral-progresivo-pasillo.js',
  './js/ejercicios-nuevo-formato/06-campobase-video-duelos-3v2-finalizacion-robo-rotacion.js',
  './js/ejercicios-nuevo-formato/07-campobase-video-finalizacion-doble-2-balones-transicion-1v1-cambio-carril-v2.js',
  './js/ejercicios-nuevo-formato/08-campobase-pase-balon-espacio-2-conos-1v1-finalizacion-v2.js',
  './js/ejercicios-nuevo-formato/09-campobase-video-pies-rapidos-sprint-3-variaciones.js',
  './js/ejercicios-nuevo-formato/10-campobase-video-reaccion-giro-inicial-senales-laterales-cono-balon-v3.js',
  './js/ejercicios-nuevo-formato/11-campobase-video-reactive-knee-drive-skater-3-variaciones.js',
  './js/ejercicios-nuevo-formato/12-campobase-video-rodillas-altas-laterales-zigzag-cod-sprint.js',
  './js/ejercicios-nuevo-formato/13-campobase-video-conduccion-dejar-balon-3-conos-pase-v2.js',
  './js/ejercicios-nuevo-formato/14-campobase-video-finalizacion-doble-tiro-transicion-1v1-cambio-carril.js',
  './js/ejercicios-nuevo-formato/15-campobase-video-reaccion-espaldas-senales-lateral-giro-cono-balon-v2.js',
  './js/ejercicios-nuevo-formato/16-campobase-video-reaccion-lateral-senal-balon-cono.js',
  './js/exercise-view-mode-ui.js?v=2519',
  './js/live-display-colors.js?v=20261009-delegate-colors-3',
  './js/live-plan-policy.js?v=20261009-postgame-sync-1',
  './js/live-tactics.js?v=claude-partido-2',
  './js/print-match-plan.js?v=20261016-print-visual-1',
  './js/print-match-visual.js?v=20261016-print-visual-1',
  './js/session-reorder-ui.js?v=1',
  './js/staff-card-layout-fix.js?v=1',
  './js/theme-component-colors.js?v=20261009-delegate-colors-3',
  './js/training-domain-base.js',

];

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const APP_ROOT = new URL('./', self.location.href);
const INDEX_URL = new URL('index.html', APP_ROOT);
const MEDIA_CACHE = `campobase-media-v1:${APP_ROOT.pathname}`;
const MEDIA_MAX_AGE = 24 * 60 * 60 * 1000;
const MEDIA_QUEUE_LIMIT = 4;
let mediaRefreshActive = false;
const mediaRefreshQueue = [];
const mediaRefreshPending = new Map();

function belongsToApp(url) {
  return url.origin === APP_ROOT.origin && url.pathname.startsWith(APP_ROOT.pathname);
}

function canonicalAssetUrl(value) {
  const url = new URL(typeof value === 'string' ? value : value.url, APP_ROOT);
  if (url.pathname === APP_ROOT.pathname) url.pathname = INDEX_URL.pathname;
  return url;
}

function isImageOrStaticAsset(url) {
  // Build-dependent board fragments, HTML, scripts and JSON never use this
  // persistent cache, even when they live below /assets/ or /library-v2/.
  return /\.(png|jpe?g|svg|webp|avif|gif|ico|woff2?|ttf|otf)$/i.test(url.pathname);
}

function isOwnedLegacyShell(name) {
  return name !== CACHE && name !== MEDIA_CACHE
    && (name.includes('campobase-v2.') || name.startsWith(`campobase-shell:${APP_ROOT.pathname}:`));
}

function mediaMetadataKey(request) {
  const url = typeof request === 'string' ? request : request.url;
  return new URL(`__campobase_media_checked__?url=${encodeURIComponent(url)}`, APP_ROOT).href;
}

async function rememberMediaCheck(cache, request) {
  await cache.put(mediaMetadataKey(request), new Response(String(Date.now()), {
    headers: { 'Content-Type': 'text/plain' },
  }));
}

async function matchingShellHtml(response) {
  const text = await response.clone().text();
  return /window\.__CAMPOBASE_BUILD\s*=\s*['"]([^'"]+)['"]/.exec(text)?.[1] === BUILD;
}

function precacheGroups() {
  const groups = new Map();
  for (const alias of ASSETS) {
    const url = canonicalAssetUrl(alias);
    if (!belongsToApp(url)) continue;
    const key = url.origin + url.pathname;
    const group = groups.get(key) || { url, aliases: new Set(), media: isImageOrStaticAsset(url) };
    group.aliases.add(new URL(alias, APP_ROOT).href);
    groups.set(key, group);
  }
  return [...groups.values()];
}

async function installBuild() {
  const shell = await caches.open(CACHE);
  const media = await caches.open(MEDIA_CACHE);
  const groups = precacheGroups();
  const failed = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < groups.length) {
      const group = groups[cursor++];
      try {
        const response = await fetch(group.url.href, { cache: 'reload', priority: 'low' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (group.url.pathname === INDEX_URL.pathname && !await matchingShellHtml(response)) {
          throw new Error('HTML de otra versión');
        }
        const cache = group.media ? media : shell;
        for (const alias of group.aliases) {
          await cache.put(alias, response.clone());
          if (group.media) await rememberMediaCheck(cache, alias);
        }
      } catch (error) {
        if (!group.media) failed.push(group.url.pathname);
      }
    }
  };
  await Promise.all(Array.from({ length: 3 }, worker));
  // A partial new shell must never replace the working offline build. Missing
  // optional icons may fall back to an older media copy without mixing code.
  if (failed.length || !await shell.match(INDEX_URL.href)) {
    throw new Error(`La actualización sigue pendiente: ${failed.join(', ')}`);
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(installBuild().then(() => self.skipWaiting()));
});

async function handOffMedia() {
  const media = await caches.open(MEDIA_CACHE);
  for (const name of await caches.keys()) {
    if (!isOwnedLegacyShell(name)) continue;
    const old = await caches.open(name);
    const requests = await old.keys();
    let canRemove = true;
    for (const request of requests) {
      const url = new URL(request.url);
      // Old cache names were not scoped. A shared cache containing another
      // project's resources is retained rather than deleting someone else's.
      if (!belongsToApp(url)) { canRemove = false; continue; }
      if (!isImageOrStaticAsset(url)) {
        // Some previous builds also cached videos or other offline downloads.
        if (!buildFiles.has(url.pathname) && !/\.(?:m?js|html|css|json|gz|b64|webmanifest)$/i.test(url.pathname) && url.pathname !== APP_ROOT.pathname) canRemove = false;
        continue;
      }
      try {
        if (!await media.match(request)) {
          const response = await old.match(request);
          if (response) await media.put(request, response);
        }
      } catch { canRemove = false; }
    }
    if (canRemove) await caches.delete(name);
  }
}

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await handOffMedia();
    await self.clients.claim();
  })());
});

async function preservedMedia(request) {
  for (const name of await caches.keys()) {
    if (!isOwnedLegacyShell(name)) continue;
    const response = await (await caches.open(name)).match(request);
    if (response) return response;
  }
  return null;
}

function pumpMediaRefreshes() {
  if (mediaRefreshActive || !mediaRefreshQueue.length) return;
  mediaRefreshActive = true;
  const job = mediaRefreshQueue.shift();
  (async () => {
    try {
      const response = await fetch(job.request, { cache: 'no-cache', priority: 'low' });
      if (response.ok) await job.cache.put(job.request, response.clone());
    } catch { /* retain the usable cached media */ }
    // Failed checks also get a quiet period, so an offline/weak connection is
    // not retried for every render of the same thumbnail.
    try { await rememberMediaCheck(job.cache, job.request); } catch {}
  })().finally(() => {
    mediaRefreshPending.delete(job.key);
    mediaRefreshActive = false;
    job.resolve();
    pumpMediaRefreshes();
  });
}

async function refreshOldMedia(cache, request) {
  if (self.navigator?.onLine === false) return;
  const key = typeof request === 'string' ? request : request.url;
  const pending = mediaRefreshPending.get(key);
  if (pending) return pending;
  try {
    const stamp = await cache.match(mediaMetadataKey(request));
    const checked = Number(stamp ? await stamp.text() : 0);
    if (Number.isFinite(checked) && Date.now() - checked < MEDIA_MAX_AGE) return;
  } catch {}
  // Another request for the same cover may have queued while metadata loaded.
  if (mediaRefreshPending.has(key)) return mediaRefreshPending.get(key);
  // Never build an unbounded queue for a gallery of exercise covers. A later
  // view/request can recheck dropped items, while the old copy stays usable.
  if (mediaRefreshQueue.length >= MEDIA_QUEUE_LIMIT) return;
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  mediaRefreshPending.set(key, promise);
  mediaRefreshQueue.push({ key, cache, request, resolve });
  pumpMediaRefreshes();
  return promise;
}

function unavailable() {
  return new Response('CampoBase no pudo cargar este recurso. Conserva tus datos y vuelve a intentarlo.', {
    status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

const buildFiles = new Map(precacheGroups().filter(group => !group.media).map(group => [group.url.pathname, group.url.href]));
let pendingBuildCheck;
function verifyPublishedBuild() {
  if (!pendingBuildCheck) {
    pendingBuildCheck = fetch(INDEX_URL.href, { cache: 'no-store' })
      .then(response => response.ok && matchingShellHtml(response))
      .catch(() => false)
      .finally(() => { pendingBuildCheck = null; });
  }
  return pendingBuildCheck;
}

async function cachedResource(request, { media = false, navigation = false } = {}) {
  const url = canonicalAssetUrl(request);
  if (navigation) url.search = '';
  const key = navigation ? url.href : request;
  const cache = await caches.open(media ? MEDIA_CACHE : CACHE);
  let cached = await cache.match(key);
  // Static Pages files differ only by pathname. Some legacy imports have a
  // different version query but refer to the same file in this active build.
  if (!cached && !media && !navigation && buildFiles.has(url.pathname)
      && [...url.searchParams.keys()].every(param => param === 'v')) {
    cached = await cache.match(buildFiles.get(url.pathname));
  }
  if (!cached && media) cached = await preservedMedia(request);
  if (cached) return { response: cached, stored: media ? refreshOldMedia(cache, request) : Promise.resolve() };
  try {
    if (!media && buildFiles.has(url.pathname) && url.pathname !== INDEX_URL.pathname && !await verifyPublishedBuild()) {
      return { response: unavailable(), stored: self.registration.update().catch(() => {}) };
    }
    const response = await fetch(request, media ? undefined : { cache: 'no-store' });
    if (!response.ok) return { response, stored: Promise.resolve() };
    if (navigation && url.pathname === INDEX_URL.pathname && !await matchingShellHtml(response)) {
      // Do not put a new HTML build above the old worker's cached modules.
      // The registration update can install and activate the coherent build.
      const check = self.registration?.update?.().catch(() => {});
      return { response: unavailable(), stored: check || Promise.resolve() };
    }
    const stored = cache.put(key, response.clone()).then(() => media ? rememberMediaCheck(cache, request) : undefined).catch(() => {});
    return { response, stored };
  } catch { return { response: unavailable(), stored: Promise.resolve() }; }
}

async function readBoardPart(path) {
  const cache = await caches.open(CACHE);
  const url = new URL(path, APP_ROOT).href;
  const cached = await cache.match(url);
  if (cached) return cached.text();
  if (!await verifyPublishedBuild()) throw new Error('Versión no disponible');
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  await cache.put(url, response.clone());
  return response.text();
}

async function buildExerciseBoardResponse() {
  const parts = await Promise.all(BOARD_PARTS.map(readBoardPart));
  const encoded = parts.join('');
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/gzip',
      'Cache-Control': 'no-store',
    },
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.headers?.has('Authorization')) return;
  const url = new URL(event.request.url);
  if (!belongsToApp(url)) return;

  if (url.pathname.endsWith('/assets/exercise-board.html.gz')) {
    event.respondWith(buildExerciseBoardResponse().catch(unavailable));
    return;
  }

  const media = isImageOrStaticAsset(url);
  const navigation = event.request.mode === 'navigate';
  if (!navigation && !media && !/\.(?:m?js|css|json|webmanifest|html|b64|gz)$/i.test(url.pathname)) return;
  const task = cachedResource(event.request, { media, navigation });
  event.respondWith(task.then(result => result.response));
  event.waitUntil(task.then(result => result.stored).catch(() => {}));
});
