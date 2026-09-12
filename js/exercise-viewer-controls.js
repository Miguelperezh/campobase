const FRAME_TITLE = 'Creador de ejercicios CampoBase';

function getViewerFrame() {
  return document.querySelector(`.exercise-board-overlay.viewer-mode iframe[title="${FRAME_TITLE}"]`)
    || document.querySelector(`iframe[title="${FRAME_TITLE}"]`);
}

function setOuterMode(mode) {
  document.querySelectorAll('.exercise-board-overlay.viewer-mode [data-board-view]').forEach((button) => {
    const active = button.dataset.boardView === mode;
    button.className = active ? 'primary' : 'secondary';
    button.setAttribute('aria-pressed', String(active));
  });
}

function triggerEmbeddedMode(mode) {
  const frame = getViewerFrame();
  if (!frame?.contentDocument) return false;
  const doc = frame.contentDocument;
  if (!doc.body?.classList?.contains('embedded-view')) return false;
  const selector = mode === 'movement'
    ? '[data-embedded-view="animated"]'
    : '[data-embedded-view="static"]';
  const target = doc.querySelector(selector);
  if (!target) return false;
  target.click();
  setOuterMode(mode);
  return true;
}

function installOuterModeBridge() {
  if (document.documentElement.dataset.viewerModeBridge === '1') return;
  document.documentElement.dataset.viewerModeBridge = '1';
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.exercise-board-overlay.viewer-mode [data-board-view]');
    if (!button) return;
    const mode = button.dataset.boardView;
    if (mode !== 'static' && mode !== 'movement') return;
    if (!triggerEmbeddedMode(mode)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
}

function patchEmbeddedViewer(doc) {
  if (!doc?.body?.classList?.contains('embedded-view')) return;

  if (!doc.getElementById('campobase-readonly-view-layout')) {
    const style = doc.createElement('style');
    style.id = 'campobase-readonly-view-layout';
    style.textContent = `
      body.embedded-view .embedded-view-controls{display:none!important}
      body.embedded-view .topbar{display:none!important}
      body.embedded-view .phase3-shell{display:none!important}
      body.embedded-view #closeBoardView{display:none!important}
      body.embedded-view .board-help,
      body.embedded-view .bottom-note{display:none!important}
      body.embedded-view .editor-shell{
        width:100%!important;
        max-width:min(1120px,calc((100dvh - 110px)*1.6))!important;
        margin:0 auto!important;
        padding:6px 8px!important;
        gap:6px!important;
      }
      body.embedded-view .center{gap:6px!important}
      body.embedded-view #boardViewBanner:not(.hidden){
        min-height:42px!important;
        padding:7px 10px!important;
        font-size:11px!important;
        border-radius:10px!important;
      }
      body.embedded-view #viewPlay:not(.hidden){
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        min-height:38px!important;
        height:38px!important;
        padding:0 14px!important;
        border-radius:9px!important;
        font-size:11px!important;
        font-weight:900!important;
      }
      body.embedded-view .legend{
        margin:0!important;
        padding:5px 7px!important;
        gap:6px!important;
        border-radius:10px!important;
      }
      body.embedded-view .legend-item{font-size:9.5px!important}
      body.embedded-view .legend-line{width:32px!important}
      body.embedded-view .board-card{padding:6px!important;border-radius:12px!important}
      body.embedded-view .board-wrap{border-radius:10px!important}
    `;
    doc.head.append(style);
  }

  const duplicateControls = doc.querySelector('.embedded-view-controls');
  if (duplicateControls) {
    duplicateControls.hidden = true;
    duplicateControls.setAttribute('aria-hidden', 'true');
  }
}

function patchViewerFrame(frame) {
  if (!frame || frame.dataset.viewerControlsPatched === '1') return;
  frame.dataset.viewerControlsPatched = '1';
  frame.addEventListener('load', () => {
    if (!frame.src || frame.src === 'about:blank') return;
    let doc;
    try { doc = frame.contentDocument; } catch { return; }
    if (!doc) return;

    const apply = () => patchEmbeddedViewer(doc);
    apply();
    setTimeout(apply, 0);
    setTimeout(apply, 80);
    setTimeout(apply, 250);
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
  `;
  document.head.append(style);
}

function discoverViewerFrames() {
  document.querySelectorAll(`iframe[title="${FRAME_TITLE}"]`).forEach(patchViewerFrame);
}

function install() {
  installViewerBackStyle();
  installOuterModeBridge();
  discoverViewerFrames();
  new MutationObserver(discoverViewerFrames).observe(document.documentElement, { childList: true, subtree: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
