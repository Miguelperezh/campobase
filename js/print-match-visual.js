// Read-only presentation of the existing plan. No persistence or team mutations.
import {describeMoment, positionChangeLines, plannedMinutes, lineupIds} from './match-moments.js';

const esc = (value = '') => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const color = value => /^#[0-9a-f]{6}$/i.test(value || '') ? value : null;
const number = value => Number(value) || 0;
const minute = value => Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
const fold = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const keeper = slot => /portero|^por$|^pt$/.test(fold(slot.pos));

export function printPlanIdentity(state = {}) {
  const settings = state.settings || {}, theme = settings.theme || {};
  const accent = color(theme.btnBg) || color(theme.accentColor) || '#a51d3d';
  const rgb = accent.slice(1).match(/../g).map(part => parseInt(part, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const luminance = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  const rawCrest = settings.clubCrest || state.clubCrest || settings.crest || '';
  // Permit configured image assets, never an executable URL or active SVG data.
  const crest = /^(?:https?:\/\/|data:image\/(?:png|jpeg|jpg|webp|gif);base64,|(?:\.\.?\/|\/)?(?:icons|assets)\/)/i.test(rawCrest) ? rawCrest : '';
  const teamName = settings.teamName?.trim() || 'Equipo';
  return {teamName, crest, accent, ink: luminance > .179 ? '#142033' : '#ffffff', initials: teamName.split(/\s+/).map(word => word[0]).slice(0, 2).join('').toUpperCase()};
}

export function playerPrintSpans(playerId, moments, duration) {
  const spans = [];
  moments.forEach((moment, index) => {
    const from = Math.max(0, number(moment.minute)), to = Math.min(duration, number(moments[index + 1]?.minute ?? duration));
    if (to <= from || !moment.team.some(slot => String(slot.playerId) === String(playerId))) return;
    if (spans.at(-1)?.to === from) spans.at(-1).to = to;
    else spans.push({from, to});
  });
  return spans;
}

export function splitPrintSpans(spans, start, end) {
  return spans.filter(span => span.to > start && span.from < end).map(span => ({from: Math.max(start, span.from) - start, to: Math.min(end, span.to) - start}));
}

export function printPositionMoves(before, after, name) {
  const moved = describeMoment(before, after).moved, seen = new Set(), lines = [];
  for (const move of moved) {
    if (seen.has(move.playerId)) continue;
    const old = before.team.find(slot => slot.playerId === move.playerId);
    const partner = moved.find(other => other.position === old.pos && before.team.find(slot => slot.playerId === other.playerId)?.pos === move.position);
    if (partner) {
      lines.push(`${name(move.playerId)} intercambia posición con ${name(partner.playerId)}: ${move.position} / ${old.pos}.`);
      seen.add(partner.playerId);
    } else lines.push(`${name(move.playerId)} pasa a ${move.position}.`);
    seen.add(move.playerId);
  }
  return lines;
}


function shortPosition(position) {
  const key=fold(position);
  if(/portero|^por$|^pt$/.test(key))return 'PT';
  if(/^(defensa|lateral).*(izq|left)/.test(key))return 'DI';
  if(/^(defensa|lateral).*(der|right)/.test(key))return 'DD';
  if(/^banda.*izq/.test(key))return 'BI';
  if(/^banda.*der/.test(key))return 'BD';
  if(/^(mediocentro|medio centro)$/.test(key))return 'MC';
  if(/^delantero$/.test(key))return 'DC';
  return position || 'Puesto';
}

function pitchSvg(initial, name, dorsal, accent, ink) {
  const rows = String(initial.formation || '').split('-').map(Number).filter(n => n > 0);
  const formation = rows.reduce((a,b) => a+b, 0) === initial.team.length ? rows : [1, initial.team.length - 1];
  let start = 0;
  const positions = [];
  formation.forEach((count,row) => {
    const indices = Array.from({length:count}, (_,i) => start+i);
    const side = index => /izq|left/.test(fold(initial.team[index]?.pos)) ? 0 : /der|right/.test(fold(initial.team[index]?.pos)) ? 2 : 1;
    indices.sort((a,b) => side(a)-side(b)).forEach((index,col) => {positions[index]={x:100*(col+1)/(count+1),y:87-row*72/Math.max(1,formation.length-1)};});
    start += count;
  });
  const tokens = initial.team.map((slot, index) => {
    const fallback = positions[index] || {x:50,y:50};
    const x = 12 + Math.max(5, Math.min(95, Number.isFinite(slot.x) ? slot.x : fallback.x)) * 2.76;
    const y = 14 + Math.max(5, Math.min(95, Number.isFinite(slot.y) ? slot.y : fallback.y)) * 2.12;
    return `<g><title>${esc(slot.pos)} · ${esc(dorsal(slot.playerId))} ${esc(name(slot.playerId, true))}</title><circle cx="${x}" cy="${y}" r="12.8" fill="${accent}"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="${ink}" font-size="11" font-weight="700">${esc(dorsal(slot.playerId))}</text><text x="${x}" y="${y+25}" text-anchor="middle" fill="#1d2b3d" font-size="9" font-weight="700">${esc(name(slot.playerId))}</text></g>`;
  }).join('');
  return `<svg class="cbv-pitch" viewBox="0 0 300 270" role="img" aria-label="Alineación inicial ${esc(initial.formation)}"><rect x="1" y="1" width="298" height="268" rx="10" fill="#f6fbf8" stroke="#c9e4d5"/><g fill="none" stroke="#acd5be" stroke-width=".8"><rect x="15" y="17" width="270" height="236" rx="2"/><path d="M15 135H285M107 17V42H193V17M107 253V228H193V253"/><circle cx="150" cy="135" r="19"/></g><text x="20" y="25" fill="#08754d" font-size="8" font-weight="700">↑ ATAQUE</text>${tokens}</svg>`;
}

// Inline and rooted: standalone preview, print and raster PDF share the same CSS.
const STYLES = `
#cb-print-root.cbv-plan{--pv-accent:#a51d3d;--pv-ink:#fff;color:#1f2d3f!important;font-family:Arial,Helvetica,sans-serif!important;}
#cb-print-root.cbv-plan *,#cb-print-root.cbv-plan *::before,#cb-print-root.cbv-plan *::after{box-sizing:border-box;}
#cb-print-root.cbv-plan .cbv-page{width:794px!important;height:1122px!important;min-height:1122px!important;max-height:none!important;padding:0!important;margin:0 auto 24px!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;background:white!important;overflow:visible!important;border:0!important;border-radius:0!important;color:#1f2d3f!important;box-shadow:0 3px 20px #0002;break-after:page;page-break-after:always;font:11px/1.3 Arial,Helvetica,sans-serif!important;}
#cb-print-root.cbv-plan .cbv-header{display:flex!important;position:static!important;visibility:visible!important;align-items:center;gap:16px;padding:19px 38px;background:var(--pv-accent)!important;color:var(--pv-ink)!important;min-height:100px;flex-shrink:0;}
#cb-print-root.cbv-plan .cbv-crest{height:53px;width:53px;object-fit:contain;background:#fff;border-radius:10px;padding:4px;flex-shrink:0;}
#cb-print-root.cbv-plan .cbv-initials{display:grid;place-items:center;color:var(--pv-accent);font-size:21px;font-weight:800;}
#cb-print-root.cbv-plan .cbv-brand{flex:1;min-width:0;}
#cb-print-root.cbv-plan .cbv-brand h1{font:800 22px/1.1 Arial,Helvetica,sans-serif!important;color:inherit!important;margin:0 0 7px!important;letter-spacing:0!important;text-transform:uppercase;}
#cb-print-root.cbv-plan .cbv-brand p{font:700 11.5px/1.3 Arial,Helvetica,sans-serif!important;color:inherit!important;margin:0!important;}
#cb-print-root.cbv-plan .cbv-system{text-align:right;font-size:11px;max-width:155px;flex-shrink:0;}
#cb-print-root.cbv-plan .cbv-system strong{display:block;font-size:15px;margin-bottom:10px;color:inherit!important;}
#cb-print-root.cbv-plan .cbv-content{display:block!important;padding:10px 38px 6px;flex:1;min-height:0;}
#cb-print-root.cbv-plan .cbv-part-head,#cb-print-root.cbv-plan .cbv-window-head{display:flex;align-items:center;gap:12px;margin:0 0 7px;}
#cb-print-root.cbv-plan .cbv-part-head h2{font:800 14px/1.3 Arial,Helvetica,sans-serif!important;color:#1f2d3f!important;margin:0!important;}
#cb-print-root.cbv-plan .cbv-part-head small,#cb-print-root.cbv-plan .cbv-window-head small{margin-left:auto;font:10px/1.3 Arial,Helvetica,sans-serif!important;color:#64748b!important;text-align:right;}
#cb-print-root.cbv-plan .cbv-window-head h3{font:800 14px/1.2 Arial,Helvetica,sans-serif!important;margin:0!important;color:#1f2d3f!important;}
#cb-print-root.cbv-plan .cbv-badge{background:var(--pv-accent)!important;color:var(--pv-ink)!important;font-size:11px;font-weight:800;padding:6px 11px;border-radius:7px;white-space:nowrap;}
#cb-print-root.cbv-plan .cbv-initial{display:grid;grid-template-columns:.9fr 1.1fr;gap:12px;margin:0 0 10px;}
#cb-print-root.cbv-plan .cbv-pitch{width:100%;height:264px;display:block;}
#cb-print-root.cbv-plan .cbv-lineup{border:1px solid #d5dfeb;border-radius:9px;padding:2px 14px;display:grid;}
#cb-print-root.cbv-plan .cbv-starter{display:grid;grid-template-columns:100px 1fr;gap:10px;align-items:center;border-bottom:1px solid #e8edf2;padding:5px 0;}
#cb-print-root.cbv-plan .cbv-starter:last-child{border-bottom:0;}
#cb-print-root.cbv-plan .cbv-starter small{font-size:9px;color:#64748b!important;font-weight:700;text-transform:uppercase;}
#cb-print-root.cbv-plan .cbv-starter strong{font-size:11.5px;color:#1f2d3f!important;overflow-wrap:anywhere;}
#cb-print-root.cbv-plan .cbv-bench{background:#f5f7fa;border:1px solid #d5dfeb;border-radius:9px;padding:11px 13px;margin-bottom:9px;line-height:1.7;}
#cb-print-root.cbv-plan .cbv-bench b{display:block;font-size:11px;margin-bottom:4px;}
#cb-print-root.cbv-plan .cbv-bench span{display:inline-block;margin-right:12px;font-weight:700;}
#cb-print-root.cbv-plan .cbv-window{margin:8px 0 10px;break-inside:avoid;page-break-inside:avoid;}
#cb-print-root.cbv-plan .cbv-window-box{border:1px solid #d5dfeb;border-radius:10px;padding:8px 12px;}
#cb-print-root.cbv-plan .cbv-changes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 12px;}
#cb-print-root.cbv-plan .cbv-change{border:1px solid #d5dfeb;border-radius:7px;padding:3px 6px;min-width:0;}
#cb-print-root.cbv-plan .cbv-change:only-child{grid-column:1/-1;}
#cb-print-root.cbv-plan .cbv-pair{display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;flex-wrap:wrap;}
#cb-print-root.cbv-plan .cbv-tag{font-size:8px;padding:3px 5px;border-radius:4px;font-weight:800;}
#cb-print-root.cbv-plan .cbv-out{background:#fbf0f3;color:#ad1235!important;}
#cb-print-root.cbv-plan .cbv-in{background:#e8f5ee;color:#08754d!important;}
#cb-print-root.cbv-plan .cbv-position{display:block;background:#eaf4f9;color:#176088!important;border-radius:4px;font-size:11px;font-weight:800;text-transform:uppercase;padding:2px 6px;margin-top:1px;}
#cb-print-root.cbv-plan .cbv-move{background:#eaf4f9;border-radius:6px;padding:7px 10px;margin:6px 0;display:flex;gap:14px;align-items:baseline;}
#cb-print-root.cbv-plan .cbv-move b{color:#176088!important;font-size:9px;flex-shrink:0;}
#cb-print-root.cbv-plan .cbv-move span{font-size:10.5px;font-weight:700;}
#cb-print-root.cbv-plan .cbv-snapshot{border-top:1px solid #e5eaf0;margin-top:6px;padding-top:5px;display:grid;gap:5px;}
#cb-print-root.cbv-plan .cbv-snapshot p{margin:0!important;display:grid;grid-template-columns:57px 1fr;gap:5px;font:700 10px/1.5 Arial,Helvetica,sans-serif!important;color:#1f2d3f!important;}
#cb-print-root.cbv-plan .cbv-snapshot b{font-size:9px;}
#cb-print-root.cbv-plan .cbv-table{width:100%;table-layout:fixed;border-collapse:collapse;font-size:10px;}
#cb-print-root.cbv-plan .cbv-table th{background:#edf1f5!important;padding:7px 8px;text-align:left;font-size:10px;color:#1f2d3f!important;text-transform:uppercase;border:0;}
#cb-print-root.cbv-plan .cbv-table th small{display:block;font-size:8px;color:#64748b!important;text-transform:none;font-weight:400;margin-top:2px;}
#cb-print-root.cbv-plan .cbv-table td{padding:7px 8px;vertical-align:middle;border:0;border-bottom:1px solid #e2e8f0;color:#1f2d3f!important;}
#cb-print-root.cbv-plan .cbv-table tr:nth-child(odd) td{background:#fafbfd!important;}
#cb-print-root.cbv-plan .cbv-table td:first-child{color:var(--pv-accent)!important;font-weight:800;font-size:12px;}
#cb-print-root.cbv-plan .cbv-table strong{font-size:10.5px;color:inherit!important;display:block;}
#cb-print-root.cbv-plan .cbv-table small{font-size:9px;color:#64748b!important;display:block;margin-top:3px;}
#cb-print-root.cbv-plan .cbv-table .cbv-min{font-size:14px!important;}
#cb-print-root.cbv-plan .cbv-track{position:relative;height:12px;background:#e7edf2;border-radius:4px;overflow:hidden;}
#cb-print-root.cbv-plan .cbv-span{position:absolute;top:0;bottom:0;background:var(--pv-accent)!important;}
#cb-print-root.cbv-plan .cbv-intervals{text-align:center;font-size:9px!important;font-weight:700;}
#cb-print-root.cbv-plan .cbv-notes{display:grid;grid-template-columns:1.15fr 1fr;gap:13px;border:1px solid #d5dfeb;border-radius:9px;padding:10px 14px;margin-top:12px;break-inside:avoid;}
#cb-print-root.cbv-plan .cbv-notes h4{color:var(--pv-accent)!important;font:800 10px Arial,Helvetica,sans-serif!important;margin:0 0 7px!important;text-transform:uppercase;}
#cb-print-root.cbv-plan .cbv-notes p{font:9px/1.45 Arial,Helvetica,sans-serif!important;color:#334155!important;margin:3px 0!important;}
#cb-print-root.cbv-plan .cbv-footer{display:flex;justify-content:space-between;gap:10px;align-items:flex-end;border-top:1px solid #d5dfeb;margin:0 38px;padding:8px 0 13px;color:#64748b!important;font:8px/1.4 Arial,Helvetica,sans-serif!important;flex-shrink:0;}
#cb-print-root.cbv-plan .cbv-footer b{white-space:nowrap;}
@media print{@page{size:A4 portrait;margin:0;}#cb-print-root.cbv-plan{padding:0!important;margin:0!important;background:white!important;}#cb-print-root.cbv-plan .cbv-page{width:210mm!important;height:296.8mm!important;min-height:296.8mm!important;margin:0!important;box-shadow:none!important;}#cb-print-root.cbv-plan .cbv-page:last-child{break-after:auto!important;page-break-after:auto!important;}#cb-print-root.cbv-plan,#cb-print-root.cbv-plan *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}
`;

export function buildVisualMatchPlan({match, state, moments, availableIds, totalDuration, halfDuration, format: selectedFormat}) {
  const identity = printPlanIdentity(state), players = state.players || [], settings = state.settings || {};
  const byId = id => players.find(player => String(player.id) === String(id));
  const dorsal = id => byId(id)?.number ?? '—';
  const name = (id, full = false) => {
    const player = byId(id); if (!player) return 'Sin ficha';
    if (full) return player.name || 'Sin nombre';
    const parts = String(player.name || '').trim().split(/\s+/);
    return player.shortName || player.nickname || (players.filter(p => p.name?.split(' ')[0] === parts[0]).length > 1 ? parts.slice(0, 2).join(' ') : parts[0]);
  };
  const label = id => `${dorsal(id)} ${name(id)}`;
  const initial = moments[0], starterIds = lineupIds(initial.team), minutes = plannedMinutes(moments, totalDuration);
  const format = String(selectedFormat || match.format || state.format || (initial.team.length === 11 ? 'F11' : 'F7'));
  const header = () => `<div class="cbv-header">${identity.crest ? `<img class="cbv-crest" src="${esc(identity.crest)}" alt="Escudo de ${esc(identity.teamName)}">` : `<div class="cbv-crest cbv-initials">${esc(identity.initials)}</div>`}<div class="cbv-brand"><h1>${esc(identity.teamName)}</h1><p>VS. ${esc(match.opponent || match.rival || 'Rival')} · ${esc(format === 'F11' ? 'FÚTBOL 11' : 'FÚTBOL 7')}</p></div><div class="cbv-system"><strong>${esc(initial.formation)}</strong>${halfDuration === totalDuration-halfDuration ? `2 partes × ${minute(halfDuration)} min` : `${minute(halfDuration)} + ${minute(totalDuration-halfDuration)} min`}</div></div>`;
  const details = [match.date?.slice(0,10).split('-').reverse().join('/'), match.time && `${match.time} h`, match.pitch || match.location, match.round && `Jornada ${match.round}`].filter(Boolean).map(esc).join(' · ');
  const start = `<div class="cbv-window-head"><span class="cbv-badge">INICIO</span><h3>${initial.team.length === 7 ? 'SIETE TITULAR' : initial.team.length === 11 ? 'ONCE TITULAR' : 'ALINEACIÓN INICIAL'}</h3><small>Inicio · minuto 0′</small></div><div class="cbv-initial">${pitchSvg(initial,name,dorsal,identity.accent,identity.ink)}<div class="cbv-lineup">${initial.team.map(slot => `<div class="cbv-starter${keeper(slot) ? ' is-gk' : ''}"><small>${esc(slot.pos)}</small><strong title="${esc(name(slot.playerId,true))}">${esc(dorsal(slot.playerId))} · ${esc(name(slot.playerId))}</strong></div>`).join('')}</div></div><div class="cbv-bench"><b>SUPLENTES DE INICIO (${availableIds.filter(id => !starterIds.includes(id)).length})</b>${availableIds.filter(id => !starterIds.includes(id)).map(id => `<span>${esc(label(id))}</span>`).join('') || 'Sin suplentes de inicio'}</div>`;
  const windows = moments.slice(1).filter(moment => moment.minute < totalDuration).map((moment, index) => {
    const previous = moments[index], diff = describeMoment(previous, moment);
    const moves = printPositionMoves(previous, moment, id => label(id));
    const moveDetails = positionChangeLines(previous, moment, id => label(id)).join(' · ');
    const clock = moment.minute < halfDuration ? `1.ª · ${minute(moment.minute)}′` : `2.ª · ${minute(moment.minute - halfDuration)}′`;
    const half = moment.minute === halfDuration;
    const changes = diff.pairs.map(pair => {
      const slot = moment.team.find(slot => slot.playerId === pair.inId);
      return `<div class="cbv-change${keeper(slot || {}) ? ' is-keeper' : ''}"><div class="cbv-pair">${pair.outId ? `<span class="cbv-tag cbv-out">SALE</span><span>${esc(label(pair.outId))}</span>` : ''}<span class="cbv-tag cbv-in">ENTRA</span><span>${esc(label(pair.inId))}</span></div><span class="cbv-position">${esc(slot?.pos || 'Puesto sin asignar')}</span></div>`;
    });
    diff.outIds.filter(id => !diff.pairs.some(pair => pair.outId === id)).forEach(id => changes.push(`<div class="cbv-change"><span class="cbv-tag cbv-out">SALE</span> ${esc(label(id))}</div>`));
    const snapshot = `<div class="cbv-snapshot"><p><b>CAMPO</b><span>${moment.team.map(slot => `${esc(shortPosition(slot.pos))} ${esc(label(slot.playerId))}`).join(' · ')}</span></p><p><b>BANCO</b><span>${availableIds.filter(id => !lineupIds(moment.team).includes(id)).map(id => esc(label(id))).join(' · ') || 'Sin suplentes'}</span></p></div>`;
    const html = `<section class="cbv-window" data-print-minute="${moment.minute}"><div class="cbv-window-head"><span class="cbv-badge" title="MINUTO ${moment.minute}′">${clock}</span><h3>${half ? 'DESCANSO Y REINICIO' : `VENTANA ${index+1}`}</h3><small>MINUTO ${minute(moment.minute)}′ · ${diff.inIds.length} sustituciones${moves.length ? ` · ${moves.length} recolocaciones` : ''}</small></div><div class="cbv-window-box"><div class="cbv-changes${changes.length >= 4 ? ' is-multi-changes' : ''}">${changes.join('')}</div>${moves.length ? `<div class="cbv-move" title="${esc(moveDetails)}"><b>${moves.length > 1 ? 'RECOLOCACIONES' : 'RECOLOCACIÓN'}</b><span>${moves.map(esc).join(' · ')}</span></div>` : ''}${diff.formation ? `<div class="cbv-move"><b>SISTEMA</b><span>${esc(diff.formation)}</span></div>` : ''}${!changes.length && !moves.length && !diff.formation ? '<p>Sin cambios de jugadores ni posiciones.</p>' : ''}${snapshot}</div></section>`;
    const height = 90 + Math.ceil(changes.length / 2) * 40 + moves.reduce((sum,line) => sum + 19 + Math.ceil(line.length/135)*14,0) + (diff.formation ? 35 : 0);
    return {html, height, second: moment.minute >= halfDuration};
  });
  const pages = [], first = windows.filter(w => !w.second), second = windows.filter(w => w.second);
  function addPart(title, items, initialHtml = '', budget = 820) {
    let content = initialHtml, remaining = budget;
    for (const item of items) {
      if (item.height > remaining && content) { pages.push({title,content}); content = ''; remaining = 850; }
      content += item.html; remaining -= item.height;
    }
    if (content) pages.push({title,content});
  }
  addPart('PRIMERA PARTE', first, start + (!windows.length ? '<p>No se han configurado ventanas de cambio intermedias.</p>' : ''), 465);
  if(second.length) addPart('DESCANSO Y SEGUNDA PARTE', second);
  const sorted = [...availableIds].sort((a,b) => Number(byId(a)?.number ?? 999) - Number(byId(b)?.number ?? 999));
  const bar = (spans, length) => `<div class="cbv-track">${spans.map(span => `<span class="cbv-span" style="left:${span.from/length*100}%;width:${(span.to-span.from)/length*100}%"></span>`).join('')}</div><small class="cbv-intervals">${spans.map(span => `${minute(span.from)}–${minute(span.to)}`).join(' + ') || 'Sin minutos'}</small>`;
  const summaryChunks = [[]]; let usedHeight = 0;
  for (const id of sorted) {
    const player = byId(id), text = `${starterIds.includes(id) ? 'Titular' : 'Suplente'} · ${player?.positions?.join(', ') || player?.position || 'Jugador'}`;
    const rowHeight = 17 + Math.ceil(name(id,true).length / 38) * 13 + Math.ceil(text.length / 48) * 11;
    if (summaryChunks.at(-1).length && (usedHeight + rowHeight > 700 || summaryChunks.at(-1).length === 15)) {summaryChunks.push([]); usedHeight=0;}
    summaryChunks.at(-1).push(id); usedHeight += rowHeight;
  }
  summaryChunks.forEach((squad,chunkIndex) => {
    const rows = squad.map(id => {
      const spans = playerPrintSpans(id,moments,totalDuration), firstHalf = splitPrintSpans(spans,0,halfDuration), lastHalf = splitPrintSpans(spans,halfDuration,totalDuration);
      const mins = minutes[id] || 0;
      return `<tr data-print-player="${esc(id)}" data-total-spans="${spans.map(span => `${minute(span.from)}′–${minute(span.to)}′`).join(', ')}"><td>${esc(dorsal(id))}</td><td><strong>${esc(name(id,true))}</strong><small>${starterIds.includes(id) ? 'Titular' : 'Suplente'} · ${esc(byId(id)?.positions?.join(', ') || byId(id)?.position || 'Jugador')}</small></td><td><strong class="cbv-min">${minute(mins)}′</strong><small>${Math.round(mins/totalDuration*100)} %</small></td><td>${bar(firstHalf,halfDuration)}</td><td>${bar(lastHalf,totalDuration-halfDuration)}</td></tr>`;
    }).join('');
    const keepers = sorted.filter(id => byId(id)?.positions?.includes('Portero') || initial.team.some(slot => slot.playerId === id && keeper(slot)));
    const notes = chunkIndex === summaryChunks.length-1 ? `<div class="cbv-notes"><div><h4>PAUTAS DEL CUERPO TÉCNICO</h4>${keepers.length ? `<p>Portería: ${keepers.map(id => `${esc(name(id))} ${minute(minutes[id] || 0)}′`).join(' · ')}.</p>` : ''}<p>Golpe/lesión: cambio directo por la misma posición.</p><p>Tiempos del partido: ${minute(halfDuration)}′ + ${minute(totalDuration-halfDuration)}′. Seguir las ventanas del plan.</p></div><div><h4>ACTA / ANOTACIONES A MANO</h4><p><b>RESULTADO:</b> _____ - _____</p><p>GOLES / ASIST.: ___________________</p><p>INCIDENCIAS: _____________________</p><p>NOTAS: __________________________</p></div></div>` : '';
    pages.push({title:'MINUTOS DE JUEGO POR JUGADOR',summary:true,content:`<div class="cbv-window-head"><span class="cbv-badge">${minute(totalDuration)}′</span><h3>REPARTO FINAL</h3><small>${availableIds.length} convocados · tramos en el césped</small></div><table class="cbv-table"><colgroup><col style="width:4.5%"><col style="width:30.5%"><col style="width:9%"><col style="width:28%"><col style="width:28%"></colgroup><thead><tr><th>#</th><th>JUGADOR / POSICIÓN HABITUAL</th><th>MIN.<small>/ ${minute(totalDuration)}′</small></th><th>1.ª PARTE<small>0′ - ${minute(halfDuration)}′</small></th><th>2.ª PARTE<small>0′ - ${minute(totalDuration-halfDuration)}′</small></th></tr></thead><tbody>${rows}</tbody></table>${notes}`});
  });
  const footer = [settings.coachName && `Entrenador: ${settings.coachName}`,settings.delegateName && `Delegado: ${settings.delegateName}`].filter(Boolean).map(esc).join(' · ');
  return `<div id="cb-print-root" class="cb-print-root cb-print-match-plan-root cbv-plan" style="--pv-accent:${identity.accent};--pv-ink:${identity.ink}"><style>${STYLES}</style>${pages.map((page,index) => `<div class="cb-print-sheet cbx-pmp-sheet cb-print-page cbv-page ${page.summary ? 'cbx-pmp-page-2' : index===0 ? 'cbx-pmp-page-1' : 'cbx-pmp-page-1b'}">${header()}<div class="cbv-content"><div class="cbv-part-head"><h2>${page.title}</h2><small>${page.summary ? `${availableIds.length} convocados` : details}</small></div>${page.content}</div><footer class="cbv-footer"><span>CampoBase${footer ? ' · '+footer : ''}<br>${details}</span><b>Página ${index+1} de ${pages.length}</b></footer></div>`).join('')}</div>`;
}
