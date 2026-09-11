const FRAME_TITLE = 'Creador de ejercicios CampoBase';

const normalizeLabel = (value = '') => String(value).replace(/\s+/g, ' ').trim();

function isDuplicateViewerControl(button) {
  const label = normalizeLabel(button?.textContent);
  return label === 'Plano fijo'
    || label === 'Movimiento'
    || label === '▶ Movimiento'
    || label === '▶ Reproducir'
    || label === 'Reproducir'
    || label === '← Ejercicios'
    || label === '← Volver a ejercicios'
    || label === 'Volver a ejercicios';
}

function hideDuplicateViewerControls(doc) {
  if (!doc?.body?.classList?.contains('embedded-view')) return;
  doc.querySelectorAll('button').forEach((button) => {
    if (!isDuplicateViewerControl(button)) return;
    button.hidden = true;
    button.tabIndex = -1;
    button.setAttribute('aria-hidden', 'true');
    button.style.setProperty('display', 'none', 'important');
  });
}

function installEmbeddedViewerFit(doc) {
  if (!doc?.body?.classList?.contains('embedded-view')) return;
  if (doc.getElementById('campobase-embedded-view-fit')) return;
  const style = doc.createElement('style');
  style.id = 'campobase-embedded-view-fit';
  style.textContent = `
    body.embedded-view{overflow:auto!important}
    body.embedded-view .editor-shell{
      width:min(100%,calc((100dvh - 145px) * 1.6))!important;
      max-width:1320px!important;
      margin:0 auto!important;
      padding:8px!important;
    }
    body.embedded-view .center{height:auto!important;min-height:0!important;overflow:visible!important}
    body.embedded-view .legend{flex:0 0 auto!important;margin:0!important}
    body.embedded-view .board-card{height:auto!important;min-height:0!important;overflow:visible!important}
    body.embedded-view .board-wrap{
      width:100%!important;
      height:auto!important;
      min-height:0!important;
      aspect-ratio:16/10!important;
      overflow:hidden!important;
    }
    body.embedded-view .board{
      display:block!important;
      width:100%!important;
      height:auto!important;
      max-width:100%!important;
      max-height:none!important;
      aspect-ratio:16/10!important;
    }
    @media(max-width:860px){
      body.embedded-view .editor-shell{width:100%!important;padding:6px!important}
      body.embedded-view .legend{gap:5px!important}
    }
  `;
  doc.head.append(style);
}

function triggerInnerPlayback(frame, attempt = 0) {
  if (!frame || !frame.contentDocument) return;
  const doc = frame.contentDocument;
  const play = doc.getElementById('viewPlay') || doc.getElementById('phasePlay');
  if (play && !play.disabled) {
    play.click();
    return;
  }
  if (attempt < 6) setTimeout(() => triggerInnerPlayback(frame, attempt + 1), 90);
}

function currentViewerFrame() {
  return document.querySelector(`.exercise-board-overlay.viewer-mode iframe[title="${FRAME_TITLE}"]`)
    || document.querySelector(`iframe[title="${FRAME_TITLE}"]`);
}

function installTopPlaybackControl() {
  const modes = document.querySelector('.exercise-board-viewer-modes');
  if (!modes || modes.querySelector('[data-board-play]')) return;
  const movement = modes.querySelector('[data-board-view="movement"]');
  if (!movement) return;

  const play = document.createElement('button');
  play.type = 'button';
  play.dataset.boardPlay = '1';
  play.className = 'secondary exercise-board-viewer-play';
  play.textContent = '▶ Reproducir';
  play.setAttribute('aria-label', 'Reproducir movimiento');
  modes.append(play);

  const syncVisibility = () => { play.hidden = movement.hidden; };
  syncVisibility();
  new MutationObserver(syncVisibility).observe(movement, { attributes: true, attributeFilter: ['hidden', 'style'] });

  movement.addEventListener('click', () => {
    setTimeout(() => triggerInnerPlayback(currentViewerFrame()), 240);
  });

  play.addEventListener('click', () => {
    if (movement.hidden) return;
    const selected = movement.getAttribute('aria-pressed') === 'true';
    if (!selected) {
      movement.click();
      return;
    }
    triggerInnerPlayback(currentViewerFrame());
  });
}

function patchViewerFrame(frame) {
  if (!frame || frame.dataset.viewerControlsPatched === '1') return;
  frame.dataset.viewerControlsPatched = '1';
  frame.addEventListener('load', () => {
    if (!frame.src || frame.src === 'about:blank') return;
    let doc;
    try { doc = frame.contentDocument; } catch { return; }
    if (!doc) return;

    const clean = () => {
      hideDuplicateViewerControls(doc);
      installEmbeddedViewerFit(doc);
    };
    clean();
    setTimeout(clean, 0);
    setTimeout(clean, 80);
    setTimeout(clean, 250);

    if (doc.body && !doc.body.dataset.viewerControlsObserver) {
      doc.body.dataset.viewerControlsObserver = '1';
      new MutationObserver(clean).observe(doc.body, { childList: true, subtree: true });
    }
  });
}

function installViewerBackStyle() {
  if (document.getElementById('campobase-viewer-back-size')) return;
  const style = document.createElement('style');
  style.id = 'campobase-viewer-back-size';
  style.textContent = `
    .exercise-board-overlay.viewer-mode .exercise-board-viewer-back{
      min-height:56px!important;
      padding:.9rem 1.35rem!important;
      border-radius:14px!important;
      font-size:16px!important;
      line-height:1.1!important;
      font-weight:850!important;
      white-space:nowrap!important;
    }
    .exercise-board-overlay.viewer-mode .exercise-board-viewer-modes button{
      min-height:52px!important;
      padding:.8rem 1.2rem!important;
      font-size:15px!important;
      border-radius:12px!important;
      font-weight:850!important;
    }
    .exercise-board-overlay.viewer-mode .exercise-board-viewer-play{
      background:#1a1a1a!important;
      border-color:#1a1a1a!important;
      color:#fff!important;
    }
  `;
  document.head.append(style);
}

function discoverViewerFrames() {
  document.querySelectorAll(`iframe[title="${FRAME_TITLE}"]`).forEach(patchViewerFrame);
  installTopPlaybackControl();
}

function install() {
  installViewerBackStyle();
  discoverViewerFrames();
  new MutationObserver(discoverViewerFrames).observe(document.documentElement, { childList: true, subtree: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
