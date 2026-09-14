// ==========================================================================
// SUITE DE COMUNICACIONES WHATSAPP — CAMPOBASE
// Generadores de mensajes para partidos, entrenos y planificación semanal.
// Funciones puras y desacopladas para pruebas unitarias e integración en UI.
// ==========================================================================

export function cleanPlayerNumber(number) {
  if (number === null || number === undefined) return '';
  const str = String(number).trim();
  return str.replace(/^#\s*/, '');
}

export function getGreetingByHour(dateOrHour = new Date()) {
  let hour = 12;
  if (typeof dateOrHour === 'number') {
    hour = dateOrHour;
  } else if (dateOrHour instanceof Date) {
    hour = dateOrHour.getHours();
  }
  if (hour >= 6 && hour < 14) return 'Buenos días';
  if (hour >= 14 && hour < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getAutoMapsUrl(fieldName, locality = 'Las Palmas') {
  const query = `${(fieldName || '').trim()} ${locality}`.trim();
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

export function formatLongDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = String(dateStr).slice(0, 10).split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${dayNames[d.getDay()]}, ${day} de ${monthNames[month - 1]} de ${year}`;
  } catch {
    return dateStr;
  }
}

export function buildWhatsAppMatchConvocatoria({
  teamName = 'C.F. Unión Viera Alevín D',
  match = {},
  callup = null,
  players = [],
  kit = 'Oficial (Roja y Negra)',
  competition = 'Liga Oficial',
  callTime = '08:15',
  gameTime = '09:00',
  fieldName = 'Campo Alfonso Silva (La Ballena)',
  mapsUrl = '',
  includeBibs = false,
  bibsConfig = '7 verdes y 7 amarillos',
  targetPlayerId = null,
  recipientType = 'group',
  parentType = 'father',
  customNote = '',
  now = new Date(),
} = {}) {
  const greeting = getGreetingByHour(now);
  const opponent = match.opponent || 'Rival';
  const rawDate = match.date || '';
  const dateFormatted = formatLongDate(rawDate) || 'Próximo partido';
  const resolvedMapsUrl = mapsUrl || getAutoMapsUrl(fieldName);

  // Determinar convocados y excluidos
  const availableSet = new Set(callup?.availableIds || []);
  const excludedSet = new Set(callup?.excludedIds || []);
  
  // Si no hay callup específico, todos los jugadores recibidos se asumen convocados
  const calledPlayers = callup
    ? players.filter(p => availableSet.has(p.id))
    : players;

  // CASO 1: Mensaje individual a progenitores
  if (recipientType === 'parent' && targetPlayerId) {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    if (targetPlayer) {
      const isExcluded = callup ? excludedSet.has(targetPlayer.id) : false;
      let parentName = '';
      if (parentType === 'mother') {
        parentName = (targetPlayer.motherName || '').trim();
      } else if (parentType === 'father') {
        parentName = (targetPlayer.fatherName || '').trim();
      }
      const salutation = parentName ? `${greeting} ${parentName}:` : `${greeting}, familia de ${targetPlayer.name}:`;
      const numStr = cleanPlayerNumber(targetPlayer.number);
      const dorsalText = numStr ? `(Dorsal ${numStr})` : '';

      // SI ESTÁ MARCADO COMO NO CONVOCADO:
      if (isExcluded) {
        return `${salutation}

Os comunicamos que ${targetPlayer.name} ${dorsalText} NO está CONVOCADO para el partido ${competition} (vs ${opponent}) del ${dateFormatted}.

¡Mucho ánimo y a seguir trabajando duro en los entrenamientos!

¡Muchas gracias a todos/as!`.trim();
      }

      // SI SÍ ESTÁ CONVOCADO:
      return `${salutation}

Os compartimos la información de la convocatoria para ${targetPlayer.name} ${dorsalText}:

🏆 *Competición:* ${competition} (vs ${opponent})
📅 *Fecha:* ${dateFormatted}
⏰ *Hora de citación:* ${callTime} h
⏱️ *Inicio de partido:* ${gameTime} h
🏟️ *Campo:* ${fieldName}
📍 *Ubicación en Google Maps:* ${resolvedMapsUrl}
👕 *Equipación:* ${kit}
🛡️ *Obligatorio:* Botella de agua individual y espinilleras${includeBibs ? `\n🎽 *Petos:* Se llevarán petos (${bibsConfig})` : ''}
${customNote ? `\n⚠️ *Nota:* ${customNote}` : ''}
• Rogamos puntualidad en la hora de citación para realizar un calentamiento óptimo.
• Ante cualquier molestia o imprevisto, avisad con antelación.

¡Muchas gracias a todos/as!`.trim();
    }
  }

  // CASO 2: Mensaje al Grupo General de Familias
  const playerListLines = calledPlayers.length
    ? calledPlayers.map((p, idx) => `${idx + 1}. ${cleanPlayerNumber(p.number)} ${p.name}`.trim()).join('\n')
    : 'Todos los jugadores de la plantilla convocados.';

  let materialBlock = `• 👕 *Equipación:* ${kit}\n• 🛡️ *Obligatorio:* Botella de agua individual y espinilleras`;
  if (includeBibs) {
    materialBlock += `\n• 🎽 *Petos:* Se llevarán petos de juego (${bibsConfig})`;
  }

  return `⚽ *CONVOCATORIA — ${teamName.toUpperCase()}* ⚽

${greeting} a todos/as,

Os compartimos la convocatoria para el próximo encuentro:

🏆 *Competición:* ${competition} (vs ${opponent})
📅 *Fecha:* ${dateFormatted}
⏰ *Hora de citación:* ${callTime} h
⏱️ *Inicio de partido:* ${gameTime} h
🏟️ *Campo:* ${fieldName}
📍 *Ubicación en Google Maps:* ${resolvedMapsUrl}

📋 *JUGADORES CONVOCADOS (${calledPlayers.length}):*
${playerListLines}

🎒 *Material y equipación:*
${materialBlock}
${customNote ? `\n⚠️ *Nota importante:* ${customNote}` : ''}
• Rogamos puntualidad en la hora de citación para realizar un buen calentamiento.
• Ante cualquier contratiempo o molestia física, por favor avisad con antelación.

¡Muchas gracias a todos/as!`.trim();
}

export function buildWhatsAppTrainingDay({
  teamName = 'C.F. Unión Viera Alevín D',
  session = {},
  fieldName = 'Campo Alfonso Silva (La Ballena)',
  mapsUrl = '',
  kitTraining = 'Equipación oficial de entrenamiento (camiseta técnica y pantalón corto)',
  targetPlayer = null,
  parentType = 'father',
  customNote = '',
  now = new Date(),
} = {}) {
  const greeting = getGreetingByHour(now);
  const rawDate = session.date || '';
  const dateFormatted = formatLongDate(rawDate) || 'Hoy';
  const timeStr = session.time || '16:30';
  const duration = session.duration || 60;
  const resolvedMapsUrl = mapsUrl || getAutoMapsUrl(fieldName);

  let salutation = `${greeting} a todos/as,`;
  if (targetPlayer) {
    let parentName = '';
    if (parentType === 'mother') parentName = (targetPlayer.motherName || '').trim();
    else if (parentType === 'father') parentName = (targetPlayer.fatherName || '').trim();
    salutation = parentName ? `${greeting} ${parentName}:` : `${greeting}, familia de ${targetPlayer.name}:`;
  }

  return `⚽ *SESIÓN DE ENTRENAMIENTO — ${teamName.toUpperCase()}* ⚽

${salutation}

Os recordamos los detalles de la sesión de entrenamiento:

📅 *Fecha:* ${dateFormatted}
⏰ *Hora:* ${timeStr} h (duración: ${duration} min)
🏟️ *Campo:* ${fieldName}
📍 *Ubicación:* ${resolvedMapsUrl}

🎒 *Material necesario:*
• 👕 *Equipación:* ${kitTraining}
• 💧 *Botella de agua individual* con su nombre
• ⚽ *Balón de fútbol T4* con la presión adecuada
${customNote ? `\n⚠️ *Nota:* ${customNote}` : ''}
Rogamos puntualidad para comenzar la sesión a la hora prevista.

¡Muchas gracias a todos/as!`.trim();
}

export function buildWhatsAppTrainingWeek({
  teamName = 'C.F. Unión Viera Alevín D',
  sessions = [],
  match = null,
  tacticalGoal = '',
  includeTacticalGoal = true,
  weekRangeLabel = 'esta semana',
  now = new Date(),
} = {}) {
  const greeting = getGreetingByHour(now);
  let goalBlock = '';
  if (includeTacticalGoal && tacticalGoal) {
    goalBlock = `🎯 *Objetivo formativo de la semana:*\n"${tacticalGoal.trim()}"\n\n`;
  }

  let scheduleLines = '';
  if (sessions.length) {
    scheduleLines = sessions.map(s => {
      const d = formatLongDate(s.date) || s.date;
      const f = s.field || s.venue || 'Campo habitual';
      const t = s.time || '16:30';
      const dur = s.duration ? ` (${s.duration} min)` : '';
      return `• *${d}:* ${t} h · ${f}${dur}`;
    }).join('\n');
  } else {
    scheduleLines = '• Lunes y Martes 16:30 h · Alfonso Silva\n• Jueves 16:30 h · Campo del Pilar';
  }

  let matchLine = '';
  if (match) {
    const md = formatLongDate(match.date) || match.date;
    const mt = match.time || '09:00';
    const mf = match.field || (match.venue === 'away' ? 'Campo rival' : 'Alfonso Silva');
    matchLine = `\n• *DOMINGO:* ${mt} h · PARTIDO vs ${match.opponent || 'Rival'} (${mf})`;
  }

  return `📅 *PLANIFICACIÓN SEMANAL (${weekRangeLabel.toUpperCase()}) — ${teamName.toUpperCase()}* ⚽

${greeting} a todos/as,

Os compartimos la planificación de entrenamientos para organizar la semana:

${goalBlock}${scheduleLines}${matchLine}

🎒 *Recordatorio para todos los entrenamientos:*
Llevar camiseta oficial de entreno, botella de agua individual y balón reglamentario T4.

¡Muchas gracias a todos/as!`.trim();
}
