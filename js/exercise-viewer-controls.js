const FRAME_TITLE = 'Creador de ejercicios CampoBase';

const normalizeLabel = (value = '') => String(value).replace(/\s+/g, ' ').trim();

function isDuplicateViewerControl(button) {
  const label = normalizeLabel(button?.textContent);
  return label === 'Plano fijo'
    || label === 'Movimiento'
    || label === '▶ Movimiento'
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

function patchViewerFrame(frame) {
  if (!frame || frame.dataset.viewerControlsPatched === '1') return;
  frame.dataset.viewerControlsPatched = '1';
  frame.addEventListener('load', () => {
    if (!frame.src || frame.src === 'about:blank') return;
    let doc;
    try { doc = frame.contentDocument; } catch { return; }
    if (!doc) return;

    const clean = () => hideDuplicateViewerControls(doc);
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
  `;
  document.head.append(style);
}

function discoverViewerFrames() {
  document.querySelectorAll(`iframe[title="${FRAME_TITLE}"]`).forEach(patchViewerFrame);
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
