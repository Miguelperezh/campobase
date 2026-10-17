// Presentation-only export. Selection, drafts and durations retain the existing plan logic.
import {normalizeMoments} from './match-moments.js';
import {buildAutoPlan} from './reparto-plan.js';
import {executePrint} from './print-session-export.js';
import {buildVisualMatchPlan} from './print-match-visual.js?v=20261016-print-visual-1';

const playerById=(players,id)=>players.find(player=>String(player.id)===String(id))||null;

export function buildMatchPlanHtml(matchOrId, state = {}, options = {}) {
  let match = null;
  let effectiveState = state || {};
  let effectiveOptions = options || {};

  if (typeof matchOrId === 'object' && matchOrId !== null && ('prep' in matchOrId || 'players' in matchOrId || 'callup' in matchOrId)) {
    match = matchOrId.match || matchOrId;
    effectiveState = {
      players: matchOrId.players || effectiveState.players || [],
      callups: matchOrId.callup ? [matchOrId.callup] : (effectiveState.callups || []),
      preparaciones: matchOrId.prep ? [matchOrId.prep] : (effectiveState.preparaciones || []),
      settings: matchOrId.settings || effectiveState.settings || {},
      ...effectiveState,
    };
    effectiveOptions = {
      prep: matchOrId.prep || effectiveOptions.prep,
      availableIds: matchOrId.availableIds || matchOrId.callup?.availableIds || effectiveOptions.availableIds,
      ...effectiveOptions,
    };
  } else {
    match = typeof matchOrId === 'object' && matchOrId !== null
      ? matchOrId
      : effectiveState?.matches?.find((m) => String(m.id) === String(matchOrId));
  }
  if (!match) return '';

  const prep = effectiveOptions.prep || effectiveState?.preparaciones?.find((p) => String(p.matchId) === String(match.id)) || null;
  const callup = effectiveState?.callups?.find((c) => c.matchId === match.id || c.id === match.callupId || String(c.id) === String(match.id)) || null;
  const players = effectiveState?.players || [];
  const squadIds = players.map((p) => p.id);
  const availableIds = (effectiveOptions.availableIds && effectiveOptions.availableIds.length)
    ? effectiveOptions.availableIds
    : (callup?.availableIds && callup.availableIds.length)
      ? callup.availableIds
      : (prep?.team && prep.team.length)
        ? prep.team.map((s) => s.playerId).filter(Boolean)
        : squadIds;

  const format = String(callup?.format || match?.format || effectiveState?.format || 'F7').toUpperCase();
  const isF11 = format === 'F11';

  // Normalizar momentos planificados
  let moments = [];
  if (options.momentsDraft && options.momentsDraft.length) {
    moments = normalizeMoments({
      team: options.momentsDraft.find(moment=>Number(moment.minute)===0)?.team || options.teamDraft || prep?.team,
      formacion: options.momentsDraft.find(moment=>Number(moment.minute)===0)?.formation || options.formacionDraft || prep?.formacion || (isF11 ? '1-4-3-3' : '1-3-2-1'),
      moments: options.momentsDraft,
    });
  } else if (prep) {
    moments = normalizeMoments(prep);
  } else {
    const basePositions = isF11
      ? ['Portero', 'Lateral derecho', 'Central derecho', 'Central izquierdo', 'Lateral izquierdo', 'Pivote', 'Interior derecho', 'Interior izquierdo', 'Extremo derecho', 'Delantero', 'Extremo izquierdo']
      : ['Portero', 'Lateral derecho', 'Central', 'Lateral izquierdo', 'Medio centro', 'Medio centro', 'Delantero'];
    moments = [{
      id: 'inicio',
      minute: 0,
      formation: isF11 ? '1-4-3-3' : '1-3-2-1',
      team: (availableIds.slice(0, isF11 ? 11 : 7)).map((id, idx) => ({ pos: basePositions[idx] || `P${idx + 1}`, playerId: id })),
    }];
  }

  // Duración oficial y tiempo de descanso según formato y tramos
  let totalDuration = isF11 ? 90 : 70;
  let halfDuration = isF11 ? 45 : 35;

  if (options.totalDuration) {
    totalDuration = options.totalDuration;
    halfDuration = options.halfDuration || Math.round(totalDuration / 2);
  } else if (match?.totalDuration || match?.duration) {
    totalDuration = match.totalDuration || match.duration;
    halfDuration = match.halfDuration || match.half || Math.round(totalDuration / 2);
  } else if (!isF11) {
    const positiveMinutes = moments.map((m) => Number(m.minute) || 0).filter((m) => m > 0);
    const maxMin = Math.max(0, ...positiveMinutes);
    if (positiveMinutes.includes(25) && maxMin === 25) {
      totalDuration = 50;
      halfDuration = 25;
    } else if (positiveMinutes.includes(30) && maxMin === 30) {
      totalDuration = 60;
      halfDuration = 30;
    } else {
      totalDuration = 70;
      halfDuration = 35;
    }
  }

  // Generación automática de rotación equitativa cuando se imprime sin preparación guardada pero hay suplentes
  if (!prep && moments.length <= 1 && availableIds.length > (isF11 ? 11 : 7)) {
    const keeperIds = availableIds.filter((id) => {
      const pl = playerById(players, id);
      return pl?.positions?.includes('Portero') || pl?.position === 'Portero';
    });
    if (!keeperIds.length && moments[0]?.team) {
      const initGk = moments[0].team.find((s) => s.pos?.toLowerCase().includes('portero') || s.pos === 'POR')?.playerId;
      if (initGk) keeperIds.push(initGk);
    }
    try {
      const auto = buildAutoPlan({
        format: isF11 ? 'F11' : 'F7',
        playerIds: availableIds,
        keeperIds,
        planMode: 'escalonado',
        customDuration: totalDuration,
      });
      if (auto?.groups && auto.groups.length) {
        const autoMoments = [moments[0]];
        for (const group of auto.groups) {
          let team = autoMoments.at(-1).team.map((slot) => ({ ...slot }));
          for (const change of group.list) {
            const index = team.findIndex((slot) => slot.playerId === change.out);
            if (index >= 0 && availableIds.includes(change.inn)) {
              team[index] = { ...team[index], playerId: change.inn };
            }
          }
          autoMoments.push({
            id: `auto-${group.m}`,
            minute: group.m,
            formation: autoMoments.at(-1).formation,
            team,
          });
        }
        moments = autoMoments;
      }
    } catch {
      // Fallback a los momentos base
    }
  }

  return buildVisualMatchPlan({match, state:effectiveState, moments, availableIds, totalDuration, halfDuration, format});
}

export function printMatchPlan(matchOrId,state,options={}){
  const html=buildMatchPlanHtml(matchOrId,state,options);
  if(html)executePrint(html);
}
